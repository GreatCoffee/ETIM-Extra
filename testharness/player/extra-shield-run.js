/**
 * extra-shield-run.js — ETIM-Extra 盾面首批验证窗（W-1…W-6 服务端面）驱动
 *
 * 判据正本：playground/audit/extra-shield-落码批文.md §1/§4
 * 任务书：  会话七验证窗任务书 · ETIM-Extra 盾面首批
 *
 * 通道分工：
 *   · 服务器命令 —— 控制台 stdin（stock RCON 一连接一包，B-EXTRA-2；本项目未挂 binpatch）
 *   · 受击者     —— mineflayer 假玩家（只登录、站着，不做任何客户端交互）
 *   · 使用态     —— `/etest useitem`（服务端直接喂 CPacketPlayerTryUseItem，
 *                   主 mod TestDriver:126-131），不依赖真实客户端右键
 *   · 受击       —— `/etest hurt <mob-selector> <amount> <player>`（causeMobDamage，src=mob）
 *   · 判据       —— run/logs/latest.log 的 [ExtraLog] / [BlockLog] 行
 *
 * 用法：node extra-shield-run.js [tag]
 * 产物：testharness/build-logs/<tag>.out（服务端全量）
 *       testharness/build-logs/<tag>-latest.log（收口快照）
 *       testharness/build-logs/<tag>-evidence.json（判行 + 逐项结论）
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { startServer } = require('../server/server-console');

const MAIN_PLAYER_DIR = 'D:\\OpenCodeWorkspace\\Easy Times In Minecraft\\git-workspace\\etim\\testharness\\player';
const { createHarnBot } = require(path.join(MAIN_PLAYER_DIR, 'fmlbot.js'));

const ROOT = path.resolve(__dirname, '..', '..');
const TAG = process.argv[2] || process.env.EXSHIELD_TAG || '12-shield-verdict-server';
const BOTNAME = process.env.EXSHIELD_BOT || 'ETIM_Harn07';
const PORT = 25565;
const RUNLOG = path.join(ROOT, 'run', 'logs', 'latest.log');
const OUTDIR = path.join(ROOT, 'testharness', 'build-logs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = () => new Date().toISOString().slice(11, 23);
const log = (tag, ...rest) => console.log(`[${stamp()}] [${tag}]`, ...rest);

const MITHRIL = 'etimextra:mithril_shield';
const ADAMANTIUM = 'etimextra:adamantium_shield';

// ---------------------------------------------------------------- 判行解析

const RE = {
  shieldItem: /\[ExtraLog\] shield item=(\S+) metal=(\S+) maxDamage=(\d+) enchantability=(\d+) stack=(\d+)/,
  shieldRecipe: /\[ExtraLog\] shield recipe=(\S+) ingot=(\S+) count=(\d+)/,
  shieldTotal: /\[ExtraLog\] shield recipes total=(\d+)/,
  boot: /\[ExtraLog\] boot ok - side=(\S+) etim=(\S+) etimextra=(\S+)/,
  gate: /\[BlockLog\] gate player=(\S+) active=(\S+) src=(\S+) suppressed=(true|false)/,
  block: /\[BlockLog\] block player=(\S+) src=(\S+) raw=([-\d.]+) blocked=([-\d.]+) factor=([-\d.]+) min=([-\d.]+) carrier=(\S+)/,
  wear: /\[BlockLog\] wear player=(\S+) item=(\S+) rate=([-\d.]+) decay=(\S+) raw=([-\d.]+) blocked=([-\d.]+) wear=(\d+) dur=(\d+)->(\d+)/,
  carrier: /\[BlockLog\] carrier item=(\S+) class=(\S+) block=(true|false)/,
  action: /\[BlockLog\] action item=(\S+) action=(\S+)/,
  state: /\[BlockLog\] state player=(\S+) handActive=(true|false) active=(\S+) held=(\S+) same=(true|false)/,
  probeDur: /\[BlockLog\] probe player=(\S+) held=(\S+) dur=(\S+)/,
  probeCfg: /\[BlockLog\] probe player=(\S+) cfg blockModel=(true|false) factor=([-\d.]+) min=([-\d.]+) shieldRate=([-\d.]+)/,
  step: /\[TestLog\] step=(\w+) player=(\S+)(.*)$/,
};

function scan(text, re) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const m = re.exec(line);
    if (m) out.push({ m, line: line.trim() });
  }
  return out;
}

/** The 5-row blockprobe invocation group, in emission order. */
function probeGroups(text) {
  const groups = [];
  let cur = null;
  for (const line of text.split(/\r?\n/)) {
    if (RE.carrier.test(line)) {
      cur = { carrier: line.trim(), action: null, state: null, dur: null, cfg: null };
      groups.push(cur);
      continue;
    }
    if (!cur) continue;
    if (RE.action.test(line) && !cur.action) { cur.action = line.trim(); continue; }
    if (RE.state.test(line) && !cur.state) { cur.state = line.trim(); continue; }
    if (RE.probeDur.test(line) && !cur.dur) { cur.dur = line.trim(); continue; }
    if (RE.probeCfg.test(line)) { cur.cfg = line.trim(); continue; }
  }
  return groups;
}

function pick(text, re, map) {
  return scan(text, re).map(({ m, line }) => Object.assign({ line }, map(m)));
}

// ---------------------------------------------------------------- 主流程

async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const srv = await startServer({ root: ROOT, tag: TAG });
  const ev = { tag: TAG, bot: BOTNAME, startedAt: new Date().toISOString(), phases: {} };

  let bot = null;
  try {
    const doneLine = await srv.ready;
    if (!doneLine) throw new Error('server never reached "Done (" within 300s');
    log('server', 'READY:', doneLine.trim());
    ev.phases.boot = { doneLine: doneLine.trim() };

    // ---------- W-1 / W-2 : boot rows（本窗新生成，不复用落码轮） ----------
    let bootText = '';
    for (let i = 0; i < 40; i++) {
      bootText = fs.readFileSync(RUNLOG, 'utf8');
      if (RE.shieldTotal.test(bootText) && RE.boot.test(bootText)) break;
      await sleep(250);
    }
    ev.W1 = {
      items: pick(bootText, RE.shieldItem, (m) => ({
        item: m[1], metal: m[2], maxDamage: +m[3], enchantability: +m[4], stack: +m[5],
      })),
    };
    ev.W2 = {
      recipes: pick(bootText, RE.shieldRecipe, (m) => ({ recipe: m[1], ingot: m[2], count: +m[3] })),
      total: (RE.shieldTotal.exec(bootText) || [])[1] || null,
      totalLine: (bootText.split(/\r?\n/).find((l) => RE.shieldTotal.test(l)) || '').trim(),
    };
    ev.bootRow = pick(bootText, RE.boot, (m) => ({ side: m[1], etim: m[2], etimextra: m[3] }));
    log('W-1', JSON.stringify(ev.W1.items));
    log('W-2', JSON.stringify(ev.W2.recipes), 'total=' + ev.W2.total);

    // ---------- 受击者进服 ----------
    try {
      bot = await createHarnBot({ host: '127.0.0.1', port: PORT, username: BOTNAME });
      await sleep(1200);
    } catch (e) {
      log('bot', 'LOGIN FAILED:', e.message);
      ev.botError = e.message;
    }

    // ---------- 世界前置（只影响可重复性，不动任何判值） ----------
    srv.send('gamerule doMobSpawning false');
    srv.send('gamerule doMobLoot false');
    srv.send('gamerule doDaylightCycle false');
    srv.send('time set 18000');
    srv.send('weather clear');
    srv.send('kill @e[type=!player]');
    if (bot) srv.send('gamemode 0 ' + BOTNAME);
    await sleep(1500);

    if (!bot) throw new Error('no fake player — B/W-3..W-6 faces unreachable');

    const pos = bot.entity.position;
    const px = (Math.round(pos.x * 100) / 100);
    const py = (Math.round(pos.y * 100) / 100);
    const pz = (Math.round(pos.z * 100) / 100);
    ev.botPos = { x: px, y: py, z: pz };
    log('bot', `joined at ${px} ${py} ${pz}`);

    // ---------- 血量前置（工装控制，非判值） ----------
    // R196 基座的血上限是 capAtLevel0=6（3 颗心），不是 1.12 的 20：8 点 raw
    // 减半后 4 点，连打三臂必死。故每臂打完把血复位到上限（`health_set`
    // params=[6.0, 6] 那行就是「设成 6、上限 6」的一手记录）。
    srv.send('say phase=B0-health');
    srv.send('etest health 6 ' + BOTNAME);
    await sleep(900);

    // ---------- Phase B1 : 手持盾（未使用态） ----------
    srv.send('say phase=B1-hold-mithril');
    srv.send('etest hold ' + MITHRIL + ' ' + BOTNAME);
    await sleep(1200);
    srv.send('etest blockprobe ' + BOTNAME);
    await sleep(900);

    // ---------- Phase B2 : 进入使用态（服务端喂 use_item） ----------
    srv.send('say phase=B2-use-mithril');
    srv.send('etest useitem ' + BOTNAME);
    await sleep(1200);
    srv.send('etest blockprobe ' + BOTNAME);
    await sleep(900);

    // ---------- Phase B3 : mob 源 8 点 → 半减 4.000 ----------
    // 选择器口径（本窗一手）：`/etest hurt <mob-selector>` 走
    // `EntitySelector.matchOneEntity(player, …)`，其入口
    // `matchEntitiesDefault:135` 要求 `sender.canUseCommand(1, "@")`——
    // **未 op 的玩家权限级 0，选择器解析为空集**（返回 null，不抛异常，故行里
    // 没有 detail=）。且要求**恰好一个**匹配。故本相位先 `deop` 打一次留档，
    // 再 `op` 重打；「权限门」因此是窗内实测证据而不是事后猜测。
    srv.send('say phase=B3-hit8-mithril');
    srv.send('kill @e[type=!player]');
    srv.send('deop ' + BOTNAME);
    await sleep(600);
    srv.send('summon minecraft:zombie ' + px + ' ' + py + ' ' + pz + ' {NoAI:1b,Silent:1b,PersistenceRequired:1b,Tags:["shx"]}');
    await sleep(800);

    const blocksNow = () => pick(fs.readFileSync(RUNLOG, 'utf8'), RE.block,
      (m) => ({ carrier: m[7], raw: +m[3] })).filter((b) => b.carrier === MITHRIL);

    srv.send('etest hurt @e[type=zombie,tag=shx] 8 ' + BOTNAME);
    await sleep(2000);
    const beforeOp = blocksNow().length;
    ev.selectorGate = { deOppedBlockRows: beforeOp };
    if (beforeOp === 0) {
      srv.send('op ' + BOTNAME);
      await sleep(1800);
      srv.send('etest hurt @e[type=zombie,tag=shx] 8 ' + BOTNAME);
      await sleep(2000);
      ev.selectorGate.opped = true;
      ev.selectorGate.postOpBlockRows = blocksNow().length;
    } else {
      ev.selectorGate.opped = false;
      ev.selectorGate.postOpBlockRows = beforeOp;
    }
    log('selectorGate', JSON.stringify(ev.selectorGate));
    srv.send('etest health 6 ' + BOTNAME);
    await sleep(600);

    // ---------- Phase B4 : 下限臂 raw=1 → blocked=max(0.5,1.0)=1.000 ----------
    srv.send('say phase=B4-hit1-mithril');
    srv.send('etest hurt @e[type=zombie,tag=shx] 1 ' + BOTNAME);
    await sleep(2000);
    srv.send('etest health 6 ' + BOTNAME);
    await sleep(600);

    // ---------- Phase B5 : 磨损后读数 ----------
    srv.send('say phase=B5-probe-mithril');
    srv.send('etest blockprobe ' + BOTNAME);
    await sleep(900);

    // ---------- Phase C1 : 艾德曼盾（第二件的使用态 + 半减 carrier 面） ----------
    srv.send('say phase=C1-adamantium');
    srv.send('etest release ' + BOTNAME);
    await sleep(600);
    srv.send('etest hold ' + ADAMANTIUM + ' ' + BOTNAME);
    await sleep(1000);
    srv.send('etest useitem ' + BOTNAME);
    await sleep(1200);
    srv.send('etest blockprobe ' + BOTNAME);
    await sleep(900);
    srv.send('etest hurt @e[type=zombie,tag=shx] 8 ' + BOTNAME);
    await sleep(2000);
    srv.send('etest blockprobe ' + BOTNAME);
    await sleep(900);

    srv.send('say phase=end');
    await sleep(600);

    // ---------- 收数 ----------
    const text = fs.readFileSync(RUNLOG, 'utf8');
    fs.writeFileSync(path.join(OUTDIR, TAG + '-latest.log'), text, 'utf8');

    ev.groups = probeGroups(text);
    ev.gate = pick(text, RE.gate, (m) => ({ player: m[1], active: m[2], src: m[3], suppressed: m[4] === 'true' }));
    ev.block = pick(text, RE.block, (m) => ({
      player: m[1], src: m[2], raw: +m[3], blocked: +m[4], factor: +m[5], min: +m[6], carrier: m[7],
    }));
    ev.wear = pick(text, RE.wear, (m) => ({
      player: m[1], item: m[2], rate: +m[3], decay: m[4], raw: +m[5], blocked: +m[6],
      wear: +m[7], durBefore: +m[8], durAfter: +m[9],
    }));
    ev.steps = scan(text, RE.step).map(({ line }) => line);

    // ---------- 逐点判定 ----------
    const near = (a, b) => Math.abs(a - b) < 0.0005;
    const mithItem = (ev.W1.items || []).find((i) => i.item === MITHRIL);
    const adamItem = (ev.W1.items || []).find((i) => i.item === ADAMANTIUM);

    const W = {};
    W['W-1'] = {
      pass: !!(mithItem && mithItem.metal === 'mithril' && mithItem.maxDamage === 25600
        && mithItem.enchantability === 100 && mithItem.stack === 1
        && adamItem && adamItem.metal === 'adamantium' && adamItem.maxDamage === 102400
        && adamItem.enchantability === 40 && adamItem.stack === 1),
      lines: (ev.W1.items || []).map((i) => JSON.stringify(i)),
    };
    const rcM = (ev.W2.recipes || []).find((r) => r.recipe === 'etimextra:shield_mithril');
    const rcA = (ev.W2.recipes || []).find((r) => r.recipe === 'etimextra:shield_adamantium');
    W['W-2'] = {
      pass: !!(rcM && rcM.count === 6 && rcM.ingot === 'etim:ingot_mithril'
        && rcA && rcA.count === 6 && rcA.ingot === 'etim:ingot_adamantium'
        && ev.W2.total === '2'),
      lines: (ev.W2.recipes || []).map((r) => JSON.stringify(r)).concat([ev.W2.totalLine]),
    };
    const gateHit = (ev.gate || []).find((g) => g.active === MITHRIL && g.src === 'mob' && g.suppressed);
    W['W-3'] = { pass: !!gateHit, line: gateHit ? gateHit.line || JSON.stringify(gateHit) : null };
    const blockHit = (ev.block || []).find((b) => b.carrier === MITHRIL && near(b.raw, 8) && near(b.blocked, 4)
      && near(b.factor, 0.5) && near(b.min, 1) && b.src === 'mob');
    const blockFloor = (ev.block || []).find((b) => b.carrier === MITHRIL && near(b.raw, 1) && near(b.blocked, 1));
    W['W-4'] = { pass: !!(blockHit && blockFloor), line: blockHit ? blockHit.line || JSON.stringify(blockHit) : null, floor: !!blockFloor };
    const wearHit = (ev.wear || []).find((w) => w.item === MITHRIL && near(w.rate, 1) && w.decay === 'na'
      && near(w.raw, 8) && near(w.blocked, 4) && w.wear === 4 && w.durBefore === 0 && w.durAfter === 4);
    const wearFloor = (ev.wear || []).find((w) => w.item === MITHRIL && near(w.raw, 1) && w.wear === 1
      && w.durBefore === 4 && w.durAfter === 5);
    W['W-5'] = { pass: !!(wearHit && wearFloor), line: wearHit ? wearHit.line || JSON.stringify(wearHit) : null, floor: !!wearFloor };
    const g = ev.groups || [];
    const gPreUse = g[0];
    const gInUse = g[1];
    const gPostWear = g[2];
    const gAdamUse = g[3];
    const gAdamPost = g[4];
    W['W-6'] = {
      pass: !!(gPreUse && gPreUse.dur && /dur=0\/25600/.test(gPreUse.dur)
        && gInUse && /dur=0\/25600/.test(gInUse.dur || '')
        && gPostWear && /dur=5\/25600/.test(gPostWear.dur || '')
        && gAdamUse && /dur=0\/102400/.test(gAdamUse.dur || '')),
      pre: gPreUse && gPreUse.dur, inUse: gInUse && gInUse.dur,
      post: gPostWear && gPostWear.dur, adam: gAdamUse && gAdamUse.dur,
      adamPost: gAdamPost && gAdamPost.dur,
    };
    ev.health = text.split(/\r?\n/).filter((l) => /has \d+ \[hp\]/.test(l)).map((l) => l.trim());
    ev.probeGroups = g;
    ev.W = W;

    for (const k of Object.keys(W)) log('VERDICT', k, W[k].pass ? 'PASS' : 'FAIL');

    fs.writeFileSync(path.join(OUTDIR, TAG + '-evidence.json'), JSON.stringify(ev, null, 1), 'utf8');
    log('evidence', path.join(OUTDIR, TAG + '-evidence.json'));
  } finally {
    try { if (bot) bot.quit(); } catch (e) { /* ignore */ }
    await sleep(1200);
    const res = await srv.stop();
    log('server', 'stopped', JSON.stringify(res));
  }
}

main().then(() => process.exit(0)).catch((e) => {
  log('FATAL', e.stack || e.message);
  process.exit(1);
});
