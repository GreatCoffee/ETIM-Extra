#!/usr/bin/env node
/**
 * extra-shield-nerf-w22.js — 盾面削弱批 W-22（config 生效）
 *
 * 判据正本：报告（定稿 `1cbaedb`）§2.9 W-22 行：
 *   把 `shield.copper.reduction` 55 → 60 后重启，铜盾 8 伤应得
 *   `blocked=3.200 factor=0.400`、`wear rate=2.500 mult=1.000 wear=8`。
 *   raw=1 地板臂不受减伤值影响（blocked=1.000、wear=2）——顺带复证不漂移。
 *
 * 窗内只改 `run/config/etimextra.cfg` 的 `I:copper.reduction=55` 一处（ASCII 替换），
 * 收口按字节副本整体还原；`etim.cfg` 的 blockDebugLog 同 W-16 处理。
 *
 * 用法：node extra-shield-nerf-w22.js [tag]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { startServer } = require('../server/server-console');

const MAIN_PLAYER_DIR = 'D:\\OpenCodeWorkspace\\Easy Times In Minecraft\\git-workspace\\etim\\testharness\\player';
const { createHarnBot } = require(path.join(MAIN_PLAYER_DIR, 'fmlbot.js'));

const ROOT = path.resolve(__dirname, '..', '..');
const TAG = process.argv[2] || process.env.EXSHIELD_W22_TAG || 'w22-config';
const BOTNAME = process.env.EXSHIELD_BOT || 'ETIM_Harn22';
const PORT = 25565;
const RUNLOG = path.join(ROOT, 'run', 'logs', 'latest.log');
const ETIMCFG = path.join(ROOT, 'run', 'config', 'etim.cfg');
const EXTRACFG = path.join(ROOT, 'run', 'config', 'etimextra.cfg');
const OUTDIR = path.join(ROOT, 'testharness', 'build-logs');

const ITEM = 'etimextra:copper_shield';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = () => new Date().toISOString().slice(11, 23);
const log = (tag, ...rest) => console.log(`[${stamp()}] [${tag}]`, ...rest);

const RE = {
  block: /\[BlockLog\] block player=(\S+) src=(\S+) raw=([-\d.]+) blocked=([-\d.]+) factor=([-\d.]+) spectral=(true|false) min=([-\d.]+) carrier=(\S+)/,
  wear: /\[BlockLog\] wear player=(\S+) item=(\S+) shield=(true|false) rate=(\S+) mult=(\S+) decay=(\S+) raw=([-\d.]+) blocked=([-\d.]+) wear=(\d+) dur=(\d+)->(\d+)/,
};

const readLog = () => {
  try { return fs.readFileSync(RUNLOG, 'utf8'); } catch (e) { return ''; }
};

function sha256(buf) {
  return require('crypto').createHash('sha256').update(buf).digest('hex').toUpperCase();
}

/** 窗内改 copper.reduction 55 → 60，并开 blockDebugLog；两件都留字节副本。 */
function prepare(extraSha, etimSha) {
  const extraBefore = fs.readFileSync(EXTRACFG);
  const etimBefore = fs.readFileSync(ETIMCFG);
  const copyExtra = path.join(OUTDIR, TAG + '-etimextra.cfg.before');
  const copyEtim = path.join(OUTDIR, TAG + '-etim.cfg.before');
  fs.mkdirSync(OUTDIR, { recursive: true });
  fs.writeFileSync(copyExtra, extraBefore);
  fs.writeFileSync(copyEtim, etimBefore);
  if (sha256(extraBefore) !== extraSha) throw new Error('etimextra.cfg sha drifted before the window');
  if (sha256(etimBefore) !== etimSha) throw new Error('etim.cfg sha drifted before the window');
  const extraText = extraBefore.toString('utf8');
  if (!/I:copper\.reduction=55/.test(extraText)) {
    throw new Error('etimextra.cfg has no I:copper.reduction=55: ' + extraText.match(/I:copper\.reduction=\d+/));
  }
  fs.writeFileSync(EXTRACFG, Buffer.from(extraText.replace('I:copper.reduction=55', 'I:copper.reduction=60'), 'utf8'));
  const etimText = etimBefore.toString('utf8');
  if (!/B:blockDebugLog=false/.test(etimText)) throw new Error('etim.cfg has no B:blockDebugLog=false');
  fs.writeFileSync(ETIMCFG, Buffer.from(etimText.replace('B:blockDebugLog=false', 'B:blockDebugLog=true'), 'utf8'));
  log('config', 'copper.reduction 55 -> 60; blockDebugLog=true (byte copies -> ' + OUTDIR + ')');
  return { copyExtra, copyEtim, extraSha, etimSha };
}

function restore(saved) {
  fs.writeFileSync(EXTRACFG, fs.readFileSync(saved.copyExtra));
  fs.writeFileSync(ETIMCFG, fs.readFileSync(saved.copyEtim));
  const a = sha256(fs.readFileSync(EXTRACFG));
  const b = sha256(fs.readFileSync(ETIMCFG));
  log('config', 'restored etimextra=' + a + (a === saved.extraSha ? ' (byte-identical)' : ' MISMATCH')
    + ' | etim=' + b + (b === saved.etimSha ? ' (byte-identical)' : ' MISMATCH'));
  return { extraSha: a, etimSha: b, identical: a === saved.extraSha && b === saved.etimSha };
}

const near = (a, b) => Math.abs(a - b) < 0.0005;

function pairOf(text, raw) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l);
  for (let i = 0; i < lines.length; i++) {
    const b = RE.block.exec(lines[i]);
    if (!b) continue;
    if (b[2] !== 'etimspectral' || !near(+b[3], raw) || b[8] !== ITEM) continue;
    const cand = [i + 1, i - 1].filter((k) => k >= 0 && k < lines.length);
    let w = null;
    let wi = -1;
    for (const k of cand) {
      const m = RE.wear.exec(lines[k]);
      if (m && m[2] === ITEM && near(+m[7], raw)) { w = m; wi = k; break; }
    }
    if (!w) continue;
    return {
      block: { line: lines[i], blocked: +b[4], factor: +b[5], spectral: b[6] === 'true' },
      wear: {
        line: lines[wi], rate: w[4], mult: w[5], wear: +w[9], durBefore: +w[10], durAfter: +w[11],
      },
    };
  }
  return null;
}

async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const extraShaBefore = sha256(fs.readFileSync(EXTRACFG));
  const etimShaBefore = sha256(fs.readFileSync(ETIMCFG));
  const saved = prepare(extraShaBefore, etimShaBefore);
  const srv = await startServer({ root: ROOT, tag: TAG });
  const ev = {
    tag: TAG, bot: BOTNAME, startedAt: new Date().toISOString(),
    extraCfgBefore: extraShaBefore, etimCfgBefore: etimShaBefore, tweak: { key: 'shield.copper.reduction', from: 55, to: 60 },
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
    srv.send('time set 18000');
    srv.send('kill @e[type=!player]');
    srv.send('gamemode 0 ' + BOTNAME);
    await sleep(1200);

    const before = readLog().length;
    srv.send('etest release ' + BOTNAME);
    await sleep(400);
    srv.send('etest hold ' + ITEM + ' ' + BOTNAME);
    await sleep(800);
    srv.send('etest useitem ' + BOTNAME);
    await sleep(900);

    srv.send('etest health 6 ' + BOTNAME);
    await sleep(300);
    srv.send('etimghost hurt ' + BOTNAME + ' 8 false');
    await sleep(1800);
    srv.send('etest health 6 ' + BOTNAME);
    await sleep(300);
    srv.send('etimghost hurt ' + BOTNAME + ' 1 false');
    await sleep(1800);

    const text = readLog().slice(before);
    const eight = pairOf(text, 8);
    const one = pairOf(text, 1);
    const checks = {
      eight: !!eight,
      blocked: !!eight && near(eight.block.blocked, 3.2),
      factor: !!eight && near(eight.block.factor, 0.4),
      wear: !!eight && near(eight.wear.wear, 8) && eight.wear.durBefore === 0 && eight.wear.durAfter === 8,
      rate: !!eight && Number(eight.wear.rate) === 2.5 && Number(eight.wear.mult) === 1.0,
      floor: !!one && near(one.block.blocked, 1.0) && !!one && one.wear.wear === 2,
    };
    ev.eight = eight ? eight.block.line + ' || ' + eight.wear.line : null;
    ev.one = one ? one.block.line + ' || ' + one.wear.line : null;
    ev.checks = checks;
    ev.pass = Object.values(checks).every(Boolean);
    log('W-22', ev.pass ? 'PASS' : 'FAIL', Object.entries(checks).map(([k, v]) => k + '=' + v).join(' '));
    if (!ev.pass) log('W-22', 'raw:', JSON.stringify(text.split(/\r?\n/).filter((l) => l.includes('[BlockLog]'))));
  } catch (e) {
    ev.fatal = e && e.stack ? e.stack : String(e);
    log('FATAL', ev.fatal);
  } finally {
    try { if (bot) bot.quit(); } catch (e) { /* ignore */ }
    await sleep(1200);
    ev.stop = await srv.stop();
    ev.cfgAfter = restore(saved);
    ev.verdict = ev.pass && ev.cfgAfter.identical && !ev.fatal ? 'PASS' : 'FAIL';
    const file = path.join(OUTDIR, TAG + '-evidence.json');
    fs.writeFileSync(file, JSON.stringify(ev, null, 2) + '\n', 'utf8');
    log('evidence', file);
    log('VERDICT', ev.verdict);
    process.exit(ev.verdict === 'PASS' ? 0 : 1);
  }
}

main().catch((e) => { log('boot', 'FATAL:', e && e.stack ? e.stack : e); process.exit(1); });
