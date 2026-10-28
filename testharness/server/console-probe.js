/**
 * console-probe.js — 控制台 stdin 通道自检（ETIM-Extra 验证窗开窗前置）
 *
 * 目的：证明 `gradlew runServer` 的 stdin 在**运行中期**仍可写入（不是只在启动
 * 时读一次），否则窗口内无法逐条下发 `/etest` 命令。
 *
 * 判据：起服 → 发 `say HARNESS_STDIN_PROBE_1` → 该行使出现在 latest.log；
 *       再发 `list` → 出现玩家列表回执；再 `stop` → Saving worlds。
 *
 * 用法：node console-probe.js [tag]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { startServer } = require('./server-console');

const ROOT = path.resolve(__dirname, '..', '..');
const TAG = process.argv[2] || '12-stdin-probe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const srv = await startServer({ root: ROOT, tag: TAG });
  const done = await srv.ready;
  console.log('[' + TAG + '] READY done=', !!done);
  srv.send('say HARNESS_STDIN_PROBE_1');
  await sleep(2500);
  srv.send('list');
  await sleep(3000);
  const res = await srv.stop();
  const log = fs.readFileSync(path.join(ROOT, 'run', 'logs', 'latest.log'), 'utf8');
  const hitSay = /HARNESS_STDIN_PROBE_1/.test(log);
  const hitList = /There are \d+ of a max \d+ players online|\] list|players online/.test(log);
  const hitStop = /Saving worlds/.test(log);
  console.log(JSON.stringify({ tag: TAG, ready: !!done, sayRow: hitSay, listRow: hitList, savingWorlds: hitStop, exit: res }));
  process.exit(hitSay && hitStop ? 0 : 1);
})().catch((e) => { console.error('FATAL', e.stack || e.message); process.exit(1); });
