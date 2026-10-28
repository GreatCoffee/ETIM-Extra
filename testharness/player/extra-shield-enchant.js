/**
 * extra-shield-enchant.js — W-7 附魔面服务端臂（ETIM-Extra 盾面首批）
 *
 * 批文 §4 把 W-7 的「附魔台三档非 0」列为用户面；但主 mod 的
 * `/etest enchantprobe <slot>` 会直接调 `EnchantmentHelper.calcItemStackEnchantability`
 * 并落 `[EnchantLog] table power=15 slot0=.. slot1=.. slot2=..` 行（CommandDevTest:380-384），
 * 与附魔台 GUI 三档同一函数。故本臂用日志把它变成服务端判据，GUI 冒烟降为「可选用户面」。
 *
 * 对照臂：`minecraft:stick`（enchantability 0）⇒ 三档全 0；盾 ⇒ 三档非 0。
 *
 * 用法：node extra-shield-enchant.js [tag]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { startServer } = require('../server/server-console');

const MAIN_PLAYER_DIR = 'D:\\OpenCodeWorkspace\\Easy Times In Minecraft\\git-workspace\\etim\\testharness\\player';
const { createHarnBot } = require(path.join(MAIN_PLAYER_DIR, 'fmlbot.js'));

const ROOT = path.resolve(__dirname, '..', '..');
const TAG = process.argv[2] || '12-shield-enchant';
const BOTNAME = process.env.EXSHIELD_BOT || 'ETIM_Harn07';
const RUNLOG = path.join(ROOT, 'run', 'logs', 'latest.log');
const OUTDIR = path.join(ROOT, 'testharness', 'build-logs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const RE_TABLE = /\[EnchantLog\] table power=15 slot0=(-?\d+) slot1=(-?\d+) slot2=(-?\d+)/;

/** phase token (`etimextra_mithril_shield`) → registry name (`etimextra:mithril_shield`). */
const itemOf = (token) => token.replace(/^etimextra_/, 'etimextra:').replace(/^minecraft_/, 'minecraft:');

/** 从既有 `-latest.log` 重算证据档（不重新起服）。 */
function reparse() {
  const text = fs.readFileSync(path.join(OUTDIR, TAG + '-latest.log'), 'utf8');
  return collect(text);
}

function collect(text) {
  const lines = text.split(/\r?\n/);
  const arms = [];
  let cur = null;
  for (const line of lines) {
    const m = /phase=enchant-(\S+)/.exec(line);
    if (m) { cur = { item: itemOf(m[1]), token: m[1], table: null }; arms.push(cur); continue; }
    const t = RE_TABLE.exec(line);
    if (t && cur && !cur.table) {
      cur.table = { power: 15, slots: [+t[1], +t[2], +t[3]], line: line.trim() };
    }
  }
  const ench = lines.filter((l) => /enchantability=/.test(l) && /shield item=/.test(l)).map((l) => l.trim());
  return {
    arms,
    enchantabilityRows: ench,
    mithrilNonZero: !!(arms[0] && arms[0].table && arms[0].table.slots.every((v) => v > 0)),
    adamantiumNonZero: !!(arms[1] && arms[1].table && arms[1].table.slots.every((v) => v > 0)),
    controlAllZero: !!(arms[2] && arms[2].table && arms[2].table.slots.every((v) => v === 0)),
  };
}

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  if (process.env.EXSHIELD_REPARSE === '1') {
    const v = reparse();
    fs.writeFileSync(path.join(OUTDIR, TAG + '-evidence.json'), JSON.stringify(v, null, 1), 'utf8');
    console.log(JSON.stringify(v, null, 1));
    return;
  }
  const srv = await startServer({ root: ROOT, tag: TAG });
  let bot = null;
  const arms = [];
  try {
    await srv.ready;
    bot = await createHarnBot({ host: '127.0.0.1', port: 25565, username: BOTNAME });
    await sleep(1200);
    srv.send('gamemode 0 ' + BOTNAME);
    srv.send('gamerule doMobSpawning false');
    srv.send('time set 18000');
    srv.send('gamerule doDaylightCycle false');
    await sleep(1200);

    for (const item of ['etimextra:mithril_shield', 'etimextra:adamantium_shield', 'minecraft:stick']) {
      srv.send('say phase=enchant-' + item);
      srv.send('etest hold ' + item + ' ' + BOTNAME);
      await sleep(900);
      srv.send('etest enchantprobe mainhand melee ' + BOTNAME);
      await sleep(1200);
    }
    srv.send('say phase=end');
    await sleep(600);

    const text = fs.readFileSync(RUNLOG, 'utf8');
    fs.writeFileSync(path.join(OUTDIR, TAG + '-latest.log'), text, 'utf8');
    const verdict = collect(text);
    fs.writeFileSync(path.join(OUTDIR, TAG + '-evidence.json'), JSON.stringify(verdict, null, 1), 'utf8');
    console.log(JSON.stringify(verdict, null, 1));
  } finally {
    try { if (bot) bot.quit(); } catch (e) { /* ignore */ }
    await sleep(1000);
    await srv.stop();
  }
})().catch((e) => { console.error('FATAL', e.stack || e.message); process.exit(1); });
