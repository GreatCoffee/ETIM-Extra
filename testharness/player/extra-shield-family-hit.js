#!/usr/bin/env node
/**
 * extra-shield-family-hit.js — 三件新盾逐一受击臂（盾面补种 W-15）
 *
 * 判据正本：playground/audit/extra-shield-补种批文.md §3（W-15，本窗新增行）
 *
 * 为什么单独跑：W-3…W-6 的格挡链此前只在秘银／艾德曼上跑过；铜／银／远古金属
 * 三件与它们同类（ETIMExtraItemShield 一行未改），但「同源」不等于「验过」。
 * 本驱动对三件逐一复跑同一条链：carrier 门 → 使用态 → mob 8 点半减 → 1 点地板
 * → 磨损与耐久分母。
 *
 * 通道分工（同 extra-shield-run.js）：
 *   · 服务器命令 —— 控制台 stdin（stock RCON 一连接一包，B-EXTRA-2）
 *   · 受击        —— /etest hurt <mob-selector> 8 <player>（causeMobDamage，src=mob）
 *   · 判据        —— [BlockLog] 行（主 mod 通道，窗内临时开 blockDebugLog）
 *
 * 用法：node extra-shield-family-hit.js [tag]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { startServer } = require('../server/server-console');

const MAIN_PLAYER_DIR = 'D:\\OpenCodeWorkspace\\Easy Times In Minecraft\\git-workspace\\etim\\testharness\\player';
const { createHarnBot } = require(path.join(MAIN_PLAYER_DIR, 'fmlbot.js'));

const ROOT = path.resolve(__dirname, '..', '..');
const TAG = process.argv[2] || process.env.EXSHIELD_HIT_TAG || '17-shield-hit';
const BOTNAME = process.env.EXSHIELD_BOT || 'ETIM_Harn07';
const PORT = 25565;
const RUNLOG = path.join(ROOT, 'run', 'logs', 'latest.log');
const ETIMCFG = path.join(ROOT, 'run', 'config', 'etim.cfg');
const OUTDIR = path.join(ROOT, 'testharness', 'build-logs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = () => new Date().toISOString().slice(11, 23);
const log = (tag, ...rest) => console.log(`[${stamp()}] [${tag}]`, ...rest);

const LEGS = [
  { metal: 'copper', item: 'etimextra:copper_shield', max: 1600 },
  { metal: 'silver', item: 'etimextra:silver_shield', max: 1600 },
  { metal: 'ancient_metal', item: 'etimextra:ancient_metal_shield', max: 6400 },
];

const RE = {
  carrier: /\[BlockLog\] carrier item=(\S+) class=(\S+) block=(true|false)/,
  gate: /\[BlockLog\] gate player=(\S+) active=(\S+) src=(\S+) suppressed=(true|false)/,
  block: /\[BlockLog\] block player=(\S+) src=(\S+) raw=([-\d.]+) blocked=([-\d.]+) factor=([-\d.]+) min=([-\d.]+) carrier=(\S+)/,
  wear: /\[BlockLog\] wear player=(\S+) item=(\S+) rate=([-\d.]+) decay=(\S+) raw=([-\d.]+) blocked=([-\d.]+) wear=(\d+) dur=(\d+)->(\d+)/,
  probeDur: /\[BlockLog\] probe player=(\S+) held=(\S+) dur=(\S+)/,
};

const readLog = () => {
  try { return fs.readFileSync(RUNLOG, 'utf8'); } catch (e) { return ''; }
};

function scan(text, re) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const m = re.exec(line);
    if (m) out.push({ m, line: line.trim() });
  }
  return out;
}

// ---------------------------------------------------------------- 配置字节级开关

/**
 * 窗内把 `B:blockDebugLog` 置 true（ASCII 替换，UTF-8 无 BOM），并把窗前字节
 * 副本存进 build-logs；收口按字节整体还原（工装纪律 6）。
 */
function enableBlockLog() {
  const before = fs.readFileSync(ETIMCFG);
  const copy = path.join(OUTDIR, TAG + '-etim.cfg.before');
  fs.mkdirSync(OUTDIR, { recursive: true });
  fs.writeFileSync(copy, before);
  const text = before.toString('utf8');
  if (!/B:blockDebugLog=false/.test(text)) {
    throw new Error('etim.cfg has no B:blockDebugLog=false to flip: ' + text.match(/B:blockDebugLog=\w+/));
  }
  fs.writeFileSync(ETIMCFG, Buffer.from(text.replace('B:blockDebugLog=false', 'B:blockDebugLog=true'), 'utf8'));
  log('config', 'blockDebugLog=true (byte copy -> ' + copy + ')');
  return { copy, shaBefore: sha256(before) };
}

function restoreBlockLog(saved) {
  const bytes = fs.readFileSync(saved.copy);
  fs.writeFileSync(ETIMCFG, bytes);
  const sha = sha256(fs.readFileSync(ETIMCFG));
  log('config', 'restored: ' + sha + (sha === saved.shaBefore ? ' (byte-identical)' : ' MISMATCH'));
  return { sha, identical: sha === saved.shaBefore };
}

function sha256(buf) {
  return require('crypto').createHash('sha256').update(buf).digest('hex').toUpperCase();
}

// ---------------------------------------------------------------- 主流程

async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const saved = enableBlockLog();
  const srv = await startServer({ root: ROOT, tag: TAG });
  const ev = {
    tag: TAG, bot: BOTNAME, startedAt: new Date().toISOString(),
    cfgBeforeSha: saved.shaBefore, legs: [],
  };

  let bot = null;
  try {
    const done = await srv.ready;
    if (!done) throw new Error('server never reached "Done (" within 300s');
    log('server', 'READY:', done.trim());

    bot = await createHarnBot({ host: '127.0.0.1', port: PORT, username: BOTNAME });
    await sleep(1500);

    srv.send('gamerule doMobSpawning false');
    srv.send('gamerule doMobLoot false');
    srv.send('gamerule doDaylightCycle false');
    srv.send('time set 18000');
    srv.send('weather clear');
    srv.send('kill @e[type=!player]');
    srv.send('gamemode 0 ' + BOTNAME);
    await sleep(1500);

    const pos = bot.entity.position.floored();
    const px = pos.x + 0.5;
    const py = pos.y;
    const pz = pos.z + 0.5;
    ev.botPos = { x: px, y: py, z: pz };

    for (const leg of LEGS) {
      const out = { metal: leg.metal, item: leg.item, max: leg.max };
      const before = readLog().length;

      srv.send('say [W15] ' + leg.metal + ' start');
      srv.send('etest release ' + BOTNAME);
      await sleep(500);
      srv.send('etest hold ' + leg.item + ' ' + BOTNAME);
      await sleep(900);
      srv.send('etest blockprobe ' + BOTNAME);   // carrier + action + state + dur(0) + cfg
      await sleep(800);
      srv.send('etest useitem ' + BOTNAME);
      await sleep(1000);
      srv.send('etest blockprobe ' + BOTNAME);   // state handActive=true
      await sleep(800);

      srv.send('kill @e[type=!player]');
      srv.send('summon minecraft:zombie ' + px + ' ' + py + ' ' + pz
        + ' {NoAI:1b,Silent:1b,PersistenceRequired:1b,Tags:["hx"]}');
      await sleep(900);
      srv.send('etest hurt @e[type=zombie,tag=hx] 8 ' + BOTNAME);
      await sleep(1600);
      srv.send('etest health 6 ' + BOTNAME);
      await sleep(400);
      srv.send('etest hurt @e[type=zombie,tag=hx] 1 ' + BOTNAME); // 地板臂
      await sleep(1600);
      srv.send('etest blockprobe ' + BOTNAME);   // dur(5) 读数
      await sleep(800);
      srv.send('etest health 6 ' + BOTNAME);
      srv.send('kill @e[type=!player]');
      await sleep(700);
      srv.send('say [W15] ' + leg.metal + ' end');

      const text = readLog().slice(before);
      const near = (a, b) => Math.abs(a - b) < 0.0005;
      const carriers = scan(text, RE.carrier).map(({ line }) => line);
      const gates = scan(text, RE.gate).map(({ m, line }) => ({
        line, active: m[2], src: m[3], suppressed: m[4] === 'true',
      }));
      const blocks = scan(text, RE.block).map(({ m, line }) => ({
        line, src: m[2], raw: +m[3], blocked: +m[4], factor: +m[5], min: +m[6], carrier: m[7],
      }));
      const wears = scan(text, RE.wear).map(({ m, line }) => ({
        line, item: m[2], rate: +m[3], decay: m[4], raw: +m[5], blocked: +m[6],
        wear: +m[7], durBefore: +m[8], durAfter: +m[9],
      }));
      const durs = scan(text, RE.probeDur).map(({ m, line }) => ({ line, held: m[2], dur: m[3] }));

      out.carrier = carriers.find((l) => l.includes('item=' + leg.item)) || null;
      const gateHit = gates.find((g) => g.active === leg.item && g.src === 'mob' && g.suppressed);
      const half = blocks.find((b) => b.carrier === leg.item && b.src === 'mob'
        && near(b.raw, 8) && near(b.blocked, 4) && near(b.factor, 0.5) && near(b.min, 1));
      const floor = blocks.find((b) => b.carrier === leg.item && b.src === 'mob'
        && near(b.raw, 1) && near(b.blocked, 1));
      const wearHalf = wears.find((w) => w.item === leg.item && near(w.rate, 1) && w.decay === 'na'
        && near(w.raw, 8) && near(w.blocked, 4) && w.wear === 4 && w.durBefore === 0 && w.durAfter === 4);
      const wearFloor = wears.find((w) => w.item === leg.item && near(w.raw, 1) && w.wear === 1
        && w.durBefore === 4 && w.durAfter === 5);
      const dur0 = durs.find((d) => d.held === leg.item && d.dur === '0/' + leg.max);
      const dur5 = durs.find((d) => d.held === leg.item && d.dur === '5/' + leg.max);

      out.gate = gateHit ? gateHit.line : null;
      out.blockHalf = half ? half.line : null;
      out.blockFloor = floor ? floor.line : null;
      out.wearHalf = wearHalf ? wearHalf.line : null;
      out.wearFloor = wearFloor ? wearFloor.line : null;
      out.dur0 = dur0 ? dur0.line : null;
      out.dur5 = dur5 ? dur5.line : null;
      out.pass = !!(out.carrier && gateHit && half && floor && wearHalf && wearFloor && dur0 && dur5);
      log('W-15', leg.metal, out.pass ? 'PASS' : 'FAIL',
        'carrier=' + !!out.carrier, 'gate=' + !!gateHit, 'half=' + !!half, 'floor=' + !!floor,
        'wear=' + !!wearHalf + '/' + !!wearFloor, 'dur=' + !!dur0 + '/' + !!dur5);
      ev.legs.push(out);
    }
  } catch (e) {
    ev.fatal = e && e.stack ? e.stack : String(e);
    log('FATAL', ev.fatal);
  } finally {
    try { if (bot) bot.quit(); } catch (e) { /* ignore */ }
    await sleep(1200);
    ev.stop = await srv.stop();
    ev.cfgAfter = restoreBlockLog(saved);
    ev.verdict = ev.legs.length === LEGS.length && ev.legs.every((l) => l.pass)
      && ev.cfgAfter.identical && !ev.fatal ? 'PASS' : 'FAIL';
    const file = path.join(OUTDIR, TAG + '-evidence.json');
    fs.writeFileSync(file, JSON.stringify(ev, null, 2) + '\n', 'utf8');
    log('evidence', file);
    log('VERDICT', ev.verdict);
    process.exit(ev.verdict === 'PASS' ? 0 : 1);
  }
}

main().catch((e) => { log('boot', 'FATAL:', e && e.stack ? e.stack : e); process.exit(1); });
