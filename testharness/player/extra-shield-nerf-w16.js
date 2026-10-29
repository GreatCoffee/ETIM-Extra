#!/usr/bin/env node
/**
 * extra-shield-nerf-w16.js — 盾面削弱批 W-16（L0 判点表）
 *
 * 判据正本：playground/audit/盾面削弱批-对照报告.md §5（L0 判点表）+
 *           §6（spectral 判据面）+ §1.4（行形）；派修本 条 37（W-16 口径）。
 *
 * 判什么（只判 L0；L3 不判）：
 *   · `[BlockLog] block`：raw=8 臂判 blocked / factor / spectral / carrier；
 *                         raw=1 臂只判 blocked=1.000（factor 触地板打 1.000，
 *                         C-38-3 判点钉 ⇒ factor 不在 raw=1 臂判）。
 *   · `[BlockLog] wear` ：raw=8 与 raw=1 两臂都判 rate(=2.5×mult) / mult /
 *                         decay=na / wear；不判击数（B-5）。
 *   · 相邻性：每次 hurt 的 block 行与 wear 行紧邻（§6.3 判据 1）。
 *   · src=etimspectral（§6.3 判据 3；不是 src=mob）。
 *   · 银盾两腿互证：同一 item、同一天内 spectral=false / true 相邻跑。
 *
 * 通道分工：服务器命令 = 控制台 stdin（stock RCON 一连接一包，B-EXTRA-2）；
 *           受击 = /etimghost hurt <player> <amount> <spectral:true|false>；
 *           举盾态 = /etest hold + /etest useitem（主 mod 工装）。
 *
 * 用法：node extra-shield-nerf-w16.js [tag]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { startServer } = require('../server/server-console');

const MAIN_PLAYER_DIR = 'D:\\OpenCodeWorkspace\\Easy Times In Minecraft\\git-workspace\\etim\\testharness\\player';
const { createHarnBot } = require(path.join(MAIN_PLAYER_DIR, 'fmlbot.js'));

const ROOT = path.resolve(__dirname, '..', '..');
const TAG = process.argv[2] || process.env.EXSHIELD_W16_TAG || 'w16-nerf-l0';
const BOTNAME = process.env.EXSHIELD_BOT || 'ETIM_Harn16';
const PORT = 25565;
const RUNLOG = path.join(ROOT, 'run', 'logs', 'latest.log');
const ETIMCFG = path.join(ROOT, 'run', 'config', 'etim.cfg');
const OUTDIR = path.join(ROOT, 'testharness', 'build-logs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = () => new Date().toISOString().slice(11, 23);
const log = (tag, ...rest) => console.log(`[${stamp()}] [${tag}]`, ...rest);

/**
 * 七腿 × 两横（raw=8 / raw=1）。判值来自报告 §5：
 * blocked8 / factor8 / mult / rate / wear8 / wear1。
 */
const LEGS = [
  { leg: 'copper',          item: 'etimextra:copper_shield',        spectral: false, blocked: 3.6, factor: 0.450, mult: 1.0, rate: 2.5,  wear8: 9,  wear1: 2 },
  { leg: 'silver-phys',     item: 'etimextra:silver_shield',        spectral: false, blocked: 4.8, factor: 0.600, mult: 1.4, rate: 3.5,  wear8: 16, wear1: 3 },
  { leg: 'silver-spectral', item: 'etimextra:silver_shield',        spectral: true,  blocked: 2.8, factor: 0.350, mult: 0.5, rate: 1.25, wear8: 3,  wear1: 1 },
  { leg: 'ancient',         item: 'etimextra:ancient_metal_shield', spectral: false, blocked: 2.8, factor: 0.350, mult: 1.0, rate: 2.5,  wear8: 7,  wear1: 2 },
  { leg: 'mithril',         item: 'etimextra:mithril_shield',       spectral: false, blocked: 2.0, factor: 0.250, mult: 1.0, rate: 2.5,  wear8: 5,  wear1: 2 },
  { leg: 'adamantium',      item: 'etimextra:adamantium_shield',    spectral: false, blocked: 1.6, factor: 0.200, mult: 1.0, rate: 2.5,  wear8: 4,  wear1: 2 },
  { leg: 'wood',            item: 'minecraft:shield',               spectral: false, blocked: 4.0, factor: 0.500, mult: 1.0, rate: 2.5,  wear8: 10, wear1: 2 },
];

const RE = {
  block: /\[BlockLog\] block player=(\S+) src=(\S+) raw=([-\d.]+) blocked=([-\d.]+) factor=([-\d.]+) spectral=(true|false) min=([-\d.]+) carrier=(\S+)/,
  wear: /\[BlockLog\] wear player=(\S+) item=(\S+) shield=(true|false) rate=(\S+) mult=(\S+) decay=(\S+) raw=([-\d.]+) blocked=([-\d.]+) wear=(\d+) dur=(\d+)->(\d+)/,
};

const readLog = () => {
  try { return fs.readFileSync(RUNLOG, 'utf8'); } catch (e) { return ''; }
};

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

const near = (a, b) => Math.abs(a - b) < 0.0005;

/** 一次 hurt 的两行：block 行与 wear 行相邻（§6.3 判据 1；实测主 mod 先打
 *  wear 再打 block，报告 §6.2 示例顺序相反 —— 只判相邻，不判先后）。 */
function pairOf(text, item, spectral, raw) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l);
  for (let i = 0; i < lines.length; i++) {
    const b = RE.block.exec(lines[i]);
    if (!b) continue;
    if (b[2] !== 'etimspectral' || !near(+b[3], raw) || b[6] !== String(spectral)) continue;
    if (raw === 8 && b[8] !== item) continue;
    const cand = [i + 1, i - 1].filter((k) => k >= 0 && k < lines.length);
    let w = null;
    let wi = -1;
    for (const k of cand) {
      const m = RE.wear.exec(lines[k]);
      if (m && m[2] === item && near(+m[7], raw)) { w = m; wi = k; break; }
    }
    if (!w) continue;
    return {
      block: {
        line: lines[i], src: b[2], raw: +b[3], blocked: +b[4], factor: +b[5],
        spectral: b[6] === 'true', min: +b[7], carrier: b[8],
      },
      wear: {
        line: lines[wi], item: w[2], shield: w[3] === 'true', rate: w[4], mult: w[5],
        decay: w[6], raw: +w[7], blocked: +w[8], wear: +w[9], durBefore: +w[10], durAfter: +w[11],
      },
      adjacent: Math.abs(wi - i) === 1,
    };
  }
  return null;
}

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

    for (const leg of LEGS) {
      const out = { leg: leg.leg, item: leg.item, spectral: leg.spectral };
      const before = readLog().length;

      srv.send('say [W16] ' + leg.leg + ' start');
      srv.send('etest release ' + BOTNAME);
      await sleep(500);
      srv.send('etest hold ' + leg.item + ' ' + BOTNAME);
      await sleep(900);
      srv.send('etest useitem ' + BOTNAME);
      await sleep(1000);

      // raw=8 臂
      srv.send('etest health 6 ' + BOTNAME);
      await sleep(300);
      srv.send('etimghost hurt ' + BOTNAME + ' 8 ' + leg.spectral);
      await sleep(1800);

      // raw=1 臂（1.0 地板）
      srv.send('etest health 6 ' + BOTNAME);
      await sleep(300);
      srv.send('etimghost hurt ' + BOTNAME + ' 1 ' + leg.spectral);
      await sleep(1800);

      const text = readLog().slice(before);
      const eight = pairOf(text, leg.item, leg.spectral, 8);
      const one = pairOf(text, leg.item, leg.spectral, 1);

      const checks = {
        eight: !!eight,
        one: !!one,
        blocked8: !!eight && near(eight.block.blocked, leg.blocked),
        factor8: !!eight && near(eight.block.factor, leg.factor),
        spectral8: !!eight && eight.block.spectral === leg.spectral,
        src: (!eight || eight.block.src === 'etimspectral') && (!one || one.block.src === 'etimspectral'),
        carrier: !eight || eight.block.carrier === leg.item,
        rate8: !!eight && Number(eight.wear.rate) === leg.rate && Number(eight.wear.mult) === leg.mult,
        decay8: !!eight && eight.wear.decay === 'na',
        wear8: !!eight && eight.wear.wear === leg.wear8 && eight.wear.durBefore === 0 && eight.wear.durAfter === leg.wear8,
        floorBlock: !!one && near(one.block.blocked, 1.0),
        rate1: !!one && Number(one.wear.rate) === leg.rate && Number(one.wear.mult) === leg.mult,
        wear1: !!one && one.wear.wear === leg.wear1 && one.wear.durBefore === leg.wear8
            && one.wear.durAfter === leg.wear8 + leg.wear1,
      };

      out.eight = eight ? eight.block.line + ' || ' + eight.wear.line : null;
      out.one = one ? one.block.line + ' || ' + one.wear.line : null;
      out.checks = checks;
      out.pass = Object.values(checks).every(Boolean);

      log('W-16', leg.leg, out.pass ? 'PASS' : 'FAIL',
        Object.entries(checks).map(([k, v]) => k + '=' + v).join(' '));
      if (!out.pass) log('W-16', leg.leg, 'raw lines:', JSON.stringify(text.split(/\r?\n/).filter((l) => l.includes('[BlockLog]'))));
      ev.legs.push(out);

      srv.send('etest release ' + BOTNAME);
      srv.send('say [W16] ' + leg.leg + ' end');
      await sleep(400);
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
