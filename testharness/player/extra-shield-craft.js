#!/usr/bin/env node
/**
 * extra-shield-craft.js — 盾面补种验证窗「真实合成消耗 6 锭」驱动（W-13 / W-14）
 *
 * 判据正本：playground/audit/extra-shield-补种批文.md §3（W-13 / W-14）
 *
 * 为什么必须真合成：W-10 的注册行只证明「注册表里有一条 6 格配方、材料是锭、
 * 产物是盾」，证明不了「玩家摆出这个形状真的能拿到盾、锭真的被吃掉」。本驱动
 * 用 mineflayer 假玩家在真服务器里开工作台、逐格摆锭、等主 mod 的 R196 合成
 * 计时器走完，再点结果槽，读回产物与库存差。
 *
 * 通道分工（同 extra-shield-run.js）：
 *   · 服务器命令 —— 控制台 stdin（stock RCON 一连接一包，B-EXTRA-2）
 *   · 摆料/取物   —— mineflayer clickWindow（服务端权威，客户端只发包）
 *   · 判据        —— `[CraftingLog]`（主 mod，窗内临时开 craftingDebugLog）
 *                     + 假玩家库存读数（摆料前后差值）
 *
 * 用法：node extra-shield-craft.js [tag]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { startServer } = require('../server/server-console');

const MAIN_PLAYER_DIR = 'D:\\OpenCodeWorkspace\\Easy Times In Minecraft\\git-workspace\\etim\\testharness\\player';
const { createHarnBot } = require(path.join(MAIN_PLAYER_DIR, 'fmlbot.js'));

const ROOT = path.resolve(__dirname, '..', '..');
const TAG = process.argv[2] || process.env.EXSHIELD_CRAFT_TAG || '15-shield-craft';
const BOTNAME = process.env.EXSHIELD_BOT || 'ETIM_Harn07';
const PORT = 25565;
const RUNLOG = path.join(ROOT, 'run', 'logs', 'latest.log');
const OUTDIR = path.join(ROOT, 'testharness', 'build-logs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = () => new Date().toISOString().slice(11, 23);
const log = (tag, ...rest) => console.log(`[${stamp()}] [${tag}]`, ...rest);

/** 五件盾：配方形状同一，只换锭。 */
const LEGS = [
  { metal: 'copper', ingot: 'etim:ingot_copper', incremental: true },
  { metal: 'silver', ingot: 'etim:ingot_silver' },
  { metal: 'ancient_metal', ingot: 'etim:ingot_ancient_metal' },
  { metal: 'mithril', ingot: 'etim:ingot_mithril' },
  { metal: 'adamantium', ingot: 'etim:ingot_adamantium' },
];

/** `"X X" / "XXX" / " X "` 的九个格位（工作台 1..9，行优先）。 */
const SIX = [1, 3, 4, 5, 6, 8];
const FIVE = [1, 3, 4, 5, 6]; // 少右下那格

const RE = {
  period: /\[CraftingLog\] \S+ \(\d+\) period SET .*period=(\d+)/,
  start: /\[CraftingLog\] \S+ \(\d+\) start crafting .*period=(\d+)/,
  complete: /\[CraftingLog\] \S+ \(\d+\) COMPLETE (.+) quality=(\S+) xp=(-?\d+)/,
  reset: /\[CraftingLog\] \S+ \(\d+\) (result gone → reset|result CHANGED .*)/,
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

/** 最近一次 period SET 的周期（ticks）；主 mod 在结果槽成形时算好。 */
function lastPeriod() {
  const rows = scan(readLog(), RE.period);
  return rows.length ? Number(rows[rows.length - 1].m[1]) : 0;
}

// ---------------------------------------------------------------- 基础动作

async function cmd(bot, c, wait = 700) {
  bot.chat(c.startsWith('/') ? c : '/' + c);
  await sleep(wait);
}

async function feed(bot) {
  await cmd(bot, '/etest food 6 6', 400);
}

async function openTable(bot, posVec) {
  const block = bot.blockAt(posVec);
  if (!block || !/crafting_table/.test(block.name)) {
    throw new Error('no crafting_table at ' + JSON.stringify({ x: posVec.x, y: posVec.y, z: posVec.z })
      + ' got ' + (block && block.name));
  }
  const winP = new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('windowOpen timeout')), 8000);
    bot.once('windowOpen', (w) => { clearTimeout(t); res(w); });
  });
  await bot.activateBlock(block);
  const win = await winP;
  await sleep(600);
  log('window', 'type=' + win.type + ' slots=' + Object.keys(win.slots).length);
  return win;
}

async function closeTable(bot) {
  try { if (bot.currentWindow) await bot.closeWindow(bot.currentWindow); } catch (e) { /* ignore */ }
  await sleep(400);
}

/** 把 `type` 物品按 `slots` 逐格放 1 个（拿整叠 → 右键若干格 → 余料放回原位）。 */
async function put(bot, type, slots) {
  const win = bot.currentWindow;
  let src = -1;
  for (const [k, s] of Object.entries(win.slots)) {
    const i = Number(k);
    if (i >= 1 && i <= 9) continue;
    if (s && s.type === type && s.count >= slots.length) { src = i; break; }
  }
  if (src < 0) throw new Error('no source stack type=' + type + ' need=' + slots.length);
  await bot.clickWindow(src, 0, 0);
  await sleep(250);
  for (const g of slots) {
    await bot.clickWindow(g, 1, 0);
    await sleep(180);
  }
  await bot.clickWindow(src, 0, 0);
  await sleep(250);
  log('put', 'type=' + type + ' src=' + src + ' -> ' + JSON.stringify(slots));
}

/** 只补 1 个到指定格（5→6 的增量臂用）。 */
async function putOne(bot, type, slot) {
  const win = bot.currentWindow;
  let src = -1;
  for (const [k, s] of Object.entries(win.slots)) {
    const i = Number(k);
    if (i >= 1 && i <= 9) continue;
    if (s && s.type === type && s.count >= 1) { src = i; break; }
  }
  if (src < 0) throw new Error('no source stack (1) type=' + type);
  await bot.clickWindow(src, 0, 0);
  await sleep(250);
  await bot.clickWindow(slot, 1, 0);
  await sleep(250);
  log('putOne', 'type=' + type + ' src=' + src + ' -> ' + slot);
}

function resultSlot(bot) {
  const w = bot.currentWindow;
  if (!w) return null;
  const s = w.slots[0];
  return s && s.count ? { type: s.type, name: s.name || null, count: s.count } : null;
}

function invCount(bot, type) {
  return bot.inventory.items().filter((i) => i.type === type).reduce((a, i) => a + i.count, 0);
}

function invAll(bot) {
  return bot.inventory.items().map((i) => `${i.name || i.type}×${i.count}`).join(', ') || '(empty)';
}

/** 等主 mod 的计时器走完（period ticks），途中每 10 s 补一次饥饿，防 hungerCraftDeny 冻结。 */
async function waitCraft(bot, periodTicks) {
  const p = periodTicks > 0 ? periodTicks : 200;
  const ms = p * 50 + 4000; // 0.05 s/tick + 4 s 余量
  log('wait', 'period=' + p + ' ticks -> ' + Math.round(ms / 1000) + 's');
  const start = Date.now();
  while (Date.now() - start < ms) {
    await sleep(Math.min(10000, ms - (Date.now() - start)));
    if (Date.now() - start < ms) await feed(bot);
  }
}

// ---------------------------------------------------------------- 单腿

async function runLeg(srv, bot, leg, tablePos) {
  const out = { metal: leg.metal, ingot: leg.ingot, incremental: !!leg.incremental };
  await closeTable(bot);
  await cmd(bot, '/clear', 500);
  await feed(bot);
  await cmd(bot, '/give ' + BOTNAME + ' ' + leg.ingot + ' 6', 900);
  const stacks = bot.inventory.items();
  if (!stacks.length) throw new Error(leg.metal + ': /give produced no inventory stack');
  const ingotStack = stacks.find((i) => i.name === leg.ingot) || stacks[0];
  const ingotType = ingotStack.type;
  out.ingotType = ingotType;
  out.given = invCount(bot, ingotType);
  out.before = { ingot: out.given, inv: invAll(bot) };
  log('leg', leg.metal + ' ingotType=' + ingotType + ' before=' + invAll(bot));
  const completeBefore = scan(readLog(), RE.complete).length;

  srv.send('say [W14] ' + leg.metal + ' start');
  await openTable(bot, tablePos);

  if (leg.incremental) {
    await put(bot, ingotType, FIVE);
    await sleep(1500);
    out.fiveSlotResult = resultSlot(bot);
    log('W-13', '5 slots -> result=' + JSON.stringify(out.fiveSlotResult));
    await putOne(bot, ingotType, 8);
    await sleep(1500);
  } else {
    await put(bot, ingotType, SIX);
    await sleep(1500);
  }

  const result = resultSlot(bot);
  out.sixSlotResult = result;
  log('W-14', leg.metal + ' 6 slots -> result=' + JSON.stringify(result));
  if (!result) {
    out.verdict = 'FAIL: no result with the six-ingot pattern';
    await closeTable(bot);
    srv.send('say [W14] ' + leg.metal + ' end');
    return out;
  }

  const shieldType = result.type;
  out.shieldType = shieldType;

  const beforeCraft = { ingot: invCount(bot, ingotType), shield: invCount(bot, shieldType) };
  out.beforeCraft = beforeCraft;

  await feed(bot);
  try {
    await bot.clickWindow(0, 0, 0); // 左键结果槽：主 mod 在此 arm 计时器
  } catch (e) {
    out.clickError = e.message;
  }
  await sleep(600);
  const period = lastPeriod();
  out.period = period;
  await waitCraft(bot, period);
  await closeTable(bot);
  await sleep(800);

  const after = { ingot: invCount(bot, ingotType), shield: invCount(bot, shieldType) };
  out.afterCraft = after;
  out.invAfter = invAll(bot);
  const consumed = beforeCraft.ingot - after.ingot;
  const gained = after.shield - beforeCraft.shield;
  out.consumed = consumed;
  out.gained = gained;
  const completeRows = scan(readLog(), RE.complete).slice(completeBefore);
  out.completeRow = completeRows.length ? completeRows[completeRows.length - 1].line : null;
  const startRows = scan(readLog(), RE.start);
  out.startRow = startRows.length ? startRows[startRows.length - 1].line : null;
  out.verdict = (consumed === 6 && gained === 1) ? 'PASS' : 'FAIL';
  log('W-14', leg.metal + ' consumed=' + consumed + ' gained=' + gained + ' -> ' + out.verdict);
  srv.send('say [W14] ' + leg.metal + ' end');
  return out;
}

// ---------------------------------------------------------------- 主流程

async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const srv = await startServer({ root: ROOT, tag: TAG });
  const ev = { tag: TAG, bot: BOTNAME, startedAt: new Date().toISOString(), legs: [] };

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
    srv.send('weather clear');
    srv.send('kill @e[type=!player]');
    srv.send('gamemode 0 ' + BOTNAME); // 生存：走真实合成路径（creative 会跳过计时器）
    srv.send('xp 0 ' + BOTNAME);
    srv.send('effect ' + BOTNAME + ' minecraft:resistance 9999 4 true');
    await sleep(1500);

    const pos = bot.entity.position;
    const base = pos.floored();
    const bx = base.x;
    const by = base.y;
    const bz = base.z;
    const tableVec = base.offset(1, 0, 0); // Vec3：blockAt 需要向量实例，不是普通对象
    const tablePos = { x: tableVec.x, y: tableVec.y, z: tableVec.z };
    srv.send('setblock ' + tablePos.x + ' ' + tablePos.y + ' ' + tablePos.z + ' minecraft:crafting_table');
    await sleep(900);
    ev.tablePos = tablePos;
    ev.botPos = { x: bx, y: by, z: bz };
    log('bot', 'pos=' + JSON.stringify(ev.botPos) + ' table=' + JSON.stringify(tablePos));

    for (const leg of LEGS) {
      ev.legs.push(await runLeg(srv, bot, leg, tableVec));
    }
  } catch (e) {
    ev.fatal = e && e.stack ? e.stack : String(e);
    log('FATAL', ev.fatal);
  } finally {
    try { if (bot) bot.quit(); } catch (e) { /* ignore */ }
    await sleep(1000);
    const stop = await srv.stop();
    ev.stop = stop;
    ev.verdict = ev.legs.length === LEGS.length && ev.legs.every((l) => l.verdict === 'PASS')
      && !ev.fatal ? 'PASS' : 'FAIL';
    const file = path.join(OUTDIR, TAG + '-evidence.json');
    fs.writeFileSync(file, JSON.stringify(ev, null, 2) + '\n', 'utf8');
    log('evidence', file);
    log('VERDICT', ev.verdict);
    process.exit(ev.verdict === 'PASS' ? 0 : 1);
  }
}

main().catch((e) => { log('boot', 'FATAL:', e && e.stack ? e.stack : e); process.exit(1); });
