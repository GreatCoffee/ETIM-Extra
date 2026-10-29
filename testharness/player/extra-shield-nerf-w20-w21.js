#!/usr/bin/env node
/**
 * extra-shield-nerf-w20-w21.js — 盾面削弱批 W-20 + W-21（分母与三支分发）
 *
 * 判据正本：playground/audit/盾面削弱批-对照报告.md（定稿 `1cbaedb`）§2.9 判点表 +
 *           §1.4「落码实况」（行形 / 行序，只判相邻）。
 *
 * W-20（brufen 分母）：`[BlockLog] probe` 行 `held=` 与 `dur=0/<max>`，五盾 + 木盾
 *   ⇒ 1,600 / 1,600 / 3,200 / 6,400 / 12,800 / 336。
 * W-21（三支分发）：
 *   ① 五盾 = `instanceof ETIMShield` 支（W-16 已判：factor≠0.500、mult 各不同）；
 *   ② 木盾 = vanilla 支（W-16 已判：factor=0.500、rate=2.500、mult=1.000）；
 *   ③ 工具 = `isBlockCarrier` 支（本窗补）：`block factor=0.500`，`wear rate=na
 *      mult=na decay=50`、`wear=(int)(blocked×50)`。
 *   本窗另取一次 `probe … cfg` 行断言 `shieldRateBase=2.500` / `woodReduction=0.500`。
 *
 * 通道分工：服务器命令 = 控制台 stdin；受击 = /etimghost hurt <player> 8 false；
 *           举盾/举工具态 = /etest hold + /etest useitem（MixinItem 起手面）。
 *
 * 用法：node extra-shield-nerf-w20-w21.js [tag]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { startServer } = require('../server/server-console');

const MAIN_PLAYER_DIR = 'D:\\OpenCodeWorkspace\\Easy Times In Minecraft\\git-workspace\\etim\\testharness\\player';
const { createHarnBot } = require(path.join(MAIN_PLAYER_DIR, 'fmlbot.js'));

const ROOT = path.resolve(__dirname, '..', '..');
const TAG = process.argv[2] || process.env.EXSHIELD_W2021_TAG || 'w20-w21';
const BOTNAME = process.env.EXSHIELD_BOT || 'ETIM_Harn21';
const PORT = 25565;
const RUNLOG = path.join(ROOT, 'run', 'logs', 'latest.log');
const ETIMCFG = path.join(ROOT, 'run', 'config', 'etim.cfg');
const OUTDIR = path.join(ROOT, 'testharness', 'build-logs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = () => new Date().toISOString().slice(11, 23);
const log = (tag, ...rest) => console.log(`[${stamp()}] [${tag}]`, ...rest);

/** W-20 分母表：五盾 + 木盾；工具腿单列（W-21 ③）。 */
const SHIELDS = [
  { leg: 'copper',    item: 'etimextra:copper_shield',       max: 1600 },
  { leg: 'silver',    item: 'etimextra:silver_shield',       max: 1600 },
  { leg: 'ancient',   item: 'etimextra:ancient_metal_shield', max: 3200 },
  { leg: 'mithril',   item: 'etimextra:mithril_shield',      max: 6400 },
  { leg: 'adamantium', item: 'etimextra:adamantium_shield',  max: 12800 },
  { leg: 'wood',      item: 'minecraft:shield',              max: 336 },
];

const TOOL = { leg: 'tool-sword', item: 'etim:sword_copper', decay: 50 };

const RE = {
  probe: /\[BlockLog\] probe player=(\S+) held=(\S+) dur=(\S+)/,
  cfg: /\[BlockLog\] probe player=(\S+) cfg blockModel=(true|false) factor=([-\d.]+) min=([-\d.]+) shieldRateBase=([-\d.]+) woodReduction=([-\d.]+)/,
  block: /\[BlockLog\] block player=(\S+) src=(\S+) raw=([-\d.]+) blocked=([-\d.]+) factor=([-\d.]+) spectral=(true|false) min=([-\d.]+) carrier=(\S+)/,
  wear: /\[BlockLog\] wear player=(\S+) item=(\S+) shield=(true|false) rate=(\S+) mult=(\S+) decay=(\S+) raw=([-\d.]+) blocked=([-\d.]+) wear=(\d+) dur=(\d+)->(\d+)/,
};

const readLog = () => {
  try { return fs.readFileSync(RUNLOG, 'utf8'); } catch (e) { return ''; }
};

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

async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const saved = enableBlockLog();
  const srv = await startServer({ root: ROOT, tag: TAG });
  const ev = { tag: TAG, bot: BOTNAME, startedAt: new Date().toISOString(), cfgBeforeSha: saved.shaBefore, legs: [], tool: null };

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

    // ---- W-20: probe 分母（五盾 + 木盾）
    for (const s of SHIELDS) {
      const before = readLog().length;
      const out = { leg: s.leg, item: s.item, expectedMax: s.max };
      srv.send('etest release ' + BOTNAME);
      await sleep(400);
      srv.send('etest hold ' + s.item + ' ' + BOTNAME);
      await sleep(800);
      srv.send('etest blockprobe ' + BOTNAME);
      await sleep(900);

      const text = readLog().slice(before);
      const probes = [];
      const cfgs = [];
      for (const line of text.split(/\r?\n/)) {
        const p = RE.probe.exec(line);
        if (p) probes.push({ line: line.trim(), held: p[2], dur: p[3] });
        const c = RE.cfg.exec(line);
        if (c) cfgs.push({ line: line.trim(), model: c[2], factor: +c[3], min: +c[4], base: +c[5], wood: +c[6] });
      }
      const hit = probes.find((p) => p.held === s.item && p.dur === '0/' + s.max) || null;
      out.probes = probes.map((p) => p.line);
      out.cfgs = cfgs.map((c) => c.line);
      out.hit = hit ? hit.line : null;
      out.cfg = cfgs.length ? cfgs[cfgs.length - 1] : null;
      out.pass = !!hit;
      log('W-20', s.leg, out.pass ? 'PASS' : 'FAIL', 'dur=' + (hit ? hit.dur : 'none'));
      ev.legs.push(out);
    }

    // ---- W-21 ③: 工具支（铜剑）
    {
      const before = readLog().length;
      const out = { leg: TOOL.leg, item: TOOL.item, decay: TOOL.decay };
      srv.send('etest release ' + BOTNAME);
      await sleep(400);
      srv.send('etest hold ' + TOOL.item + ' ' + BOTNAME);
      await sleep(800);
      srv.send('etest useitem ' + BOTNAME);
      await sleep(900);
      srv.send('etest health 6 ' + BOTNAME);
      await sleep(300);
      srv.send('etimghost hurt ' + BOTNAME + ' 8 false');
      await sleep(1800);

      const text = readLog().slice(before);
      const blocks = [];
      const wears = [];
      for (const line of text.split(/\r?\n/)) {
        const b = RE.block.exec(line);
        if (b) blocks.push({ line: line.trim(), src: b[2], raw: +b[3], blocked: +b[4], factor: +b[5], spectral: b[6] === 'true', carrier: b[7] });
        const w = RE.wear.exec(line);
        if (w) wears.push({ line: line.trim(), item: w[2], shield: w[3] === 'true', rate: w[4], mult: w[5], decay: w[6], raw: +w[7], blocked: +w[8], wear: +w[9], durBefore: +w[10], durAfter: +w[11] });
      }
      const b = blocks.find((x) => x.src === 'etimspectral' && near(x.raw, 8) && near(x.blocked, 4.0) && near(x.factor, 0.5)) || null;
      const w = wears.find((x) => x.item === TOOL.item && x.rate === 'na' && x.mult === 'na' && x.decay === '50') || null;
      out.block = b ? b.line : null;
      out.wear = w ? w.line : null;
      out.checks = {
        block: !!b,
        factorHalf: !!b && near(b.factor, 0.5) && near(b.blocked, 4.0),
        wearShape: !!w,
        wearValue: !!w && w.wear === 200 && w.durBefore === 0 && w.durAfter === 200,
      };
      out.pass = Object.values(out.checks).every(Boolean);
      log('W-21', TOOL.leg, out.pass ? 'PASS' : 'FAIL', Object.entries(out.checks).map(([k, v]) => k + '=' + v).join(' '));
      if (!out.pass) log('W-21', TOOL.leg, 'raw:', JSON.stringify(text.split(/\r?\n/).filter((l) => l.includes('[BlockLog]'))));
      ev.tool = out;
    }
  } catch (e) {
    ev.fatal = e && e.stack ? e.stack : String(e);
    log('FATAL', ev.fatal);
  } finally {
    try { if (bot) bot.quit(); } catch (e) { /* ignore */ }
    await sleep(1200);
    ev.stop = await srv.stop();
    ev.cfgAfter = restoreBlockLog(saved);
    ev.verdict = ev.legs.length === SHIELDS.length && ev.legs.every((l) => l.pass)
      && ev.tool && ev.tool.pass && ev.cfgAfter.identical && !ev.fatal ? 'PASS' : 'FAIL';
    const file = path.join(OUTDIR, TAG + '-evidence.json');
    fs.writeFileSync(file, JSON.stringify(ev, null, 2) + '\n', 'utf8');
    log('evidence', file);
    log('VERDICT', ev.verdict);
    process.exit(ev.verdict === 'PASS' ? 0 : 1);
  }
}

main().catch((e) => { log('boot', 'FATAL:', e && e.stack ? e.stack : e); process.exit(1); });
