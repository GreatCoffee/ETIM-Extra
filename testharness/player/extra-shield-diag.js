/**
 * extra-shield-diag.js — 选择器面诊断（一次起服，逐条比对）
 *
 * 目的：12-shield-verdict-server 窗里 `summon` 报 "Object successfully summoned"
 * 但 `@e[type=minecraft:zombie,tag=shx,c=1]` 解析为 NO_TARGET。本脚本在同一
 * 窗口把选择器的每个因子（命名空间 / tag / c= / limit= / NBT 有无）拆开，逐条
 * 让服务器自己回答，用来定位是**选择器写法**问题还是**实体真的不在**。
 *
 * 用法：node extra-shield-diag.js [tag]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { startServer } = require('../server/server-console');

const MAIN_PLAYER_DIR = 'D:\\OpenCodeWorkspace\\Easy Times In Minecraft\\git-workspace\\etim\\testharness\\player';
const { createHarnBot } = require(path.join(MAIN_PLAYER_DIR, 'fmlbot.js'));

const ROOT = path.resolve(__dirname, '..', '..');
const TAG = process.argv[2] || '12-shield-diag';
const BOTNAME = process.env.EXSHIELD_BOT || 'ETIM_Harn07';
const RUNLOG = path.join(ROOT, 'run', 'logs', 'latest.log');
const OUTDIR = path.join(ROOT, 'testharness', 'build-logs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const srv = await startServer({ root: ROOT, tag: TAG });
  let bot = null;
  try {
    await srv.ready;
    bot = await createHarnBot({ host: '127.0.0.1', port: 25565, username: BOTNAME });
    await sleep(1200);
    const p = bot.entity.position;
    const X = Math.round(p.x * 100) / 100;
    const Y = Math.round(p.y * 100) / 100;
    const Z = Math.round(p.z * 100) / 100;
    console.log('bot at', X, Y, Z);

    srv.send('gamemode 0 ' + BOTNAME);
    srv.send('gamerule doMobSpawning false');
    srv.send('time set day');
    srv.send('kill @e[type=!player]');
    await sleep(1200);

    const probes = [
      'testfor @e[type=zombie]',
      'testfor @e[type=minecraft:zombie]',
      'testfor @e[tag=shx]',
      'testfor @e[type=zombie,tag=shx]',
      'testfor @e[type=zombie,c=1]',
      'testfor @e[type=zombie,limit=1]',
      'entitydata @e[type=zombie,c=1] {}',
      'list',
    ];
    const dump = async (label) => {
      srv.send('say ==== ' + label + ' ====');
      await sleep(500);
      for (const c of probes) { srv.send(c); await sleep(450); }
      await sleep(600);
    };

    srv.send('summon minecraft:zombie ' + (X + 2) + ' ' + Y + ' ' + Z + ' {NoAI:1b,Silent:1b,PersistenceRequired:1b,Tags:["shx"]}');
    await sleep(1200);
    await dump('A-withNBT');
    srv.send('summon minecraft:zombie ' + (X + 3) + ' ' + Y + ' ' + Z);
    await sleep(1200);
    await dump('B-plain');
    srv.send('etest hurt @e[type=zombie,c=1] 8 ' + BOTNAME);
    await sleep(1500);
    await dump('C-afterHurt');

    const text = fs.readFileSync(RUNLOG, 'utf8');
    fs.writeFileSync(path.join(OUTDIR, TAG + '-latest.log'), text, 'utf8');
    const keep = text.split(/\r?\n/).filter((l) => /==== |Test passed|No entity|Found|Data tag|Object successfully|There are|BlockLog|TestLog|zombie/i.test(l));
    fs.writeFileSync(path.join(OUTDIR, TAG + '-rows.txt'), keep.join('\n'), 'utf8');
    console.log(keep.join('\n'));
  } finally {
    try { if (bot) bot.quit(); } catch (e) { /* ignore */ }
    await sleep(800);
    await srv.stop();
  }
})().catch((e) => { console.error('FATAL', e.stack || e.message); process.exit(1); });
