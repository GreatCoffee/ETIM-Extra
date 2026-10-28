#!/usr/bin/env node
/**
 * report-check.js — 对照报告机械核讫（etim-mapping / 会话六自检）。
 *
 * 用法：
 *   node .opencode/skills/etim-mapping/scripts/report-check.js <报告路径> [--roots=a;b] [--quiet]
 *
 * 检查五项：
 *   1. 字节规格：UTF-8 合法、无 BOM、LF（CR=0）、0 U+FFFD、无残留占位符
 *   2. 锚点存在性：每个 `X.java:NN` 能在四棵树里找到同名文件，且行号≤文件行数
 *   3. 表格完整性：GFM 表每行的未转义 `|` 数一致（代码里的 `|` 必须写 `\|`）
 *   4. 分组面数：`| M<n>-…` 行数按组统计（与 §0 声明人工对照）
 *   5. 冲突/待裁：A/B/C/D 行数统计
 *
 * 默认四棵树（相对 cwd）：
 *   mite-src/decompile/src/net/minecraft
 *   git-workspace/etim/build/rfg/minecraft-src/java/net/minecraft
 *   git-workspace/etim/build/rfg/minecraft-src/java/net/minecraftforge
 *   git-workspace/etim/src/main/java/io/github/etim/etim
 *
 * 退出码：0 全绿；1 有 FAIL；2 参数缺失。
 * 只做机械核讫，不改正文（本脚本不写文件）。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const quiet = args.includes('--quiet');
const rootsArg = args.find((a) => a.startsWith('--roots='));
if (!file) {
  console.error('usage: node report-check.js <report.md> [--roots=a;b] [--quiet]');
  process.exit(2);
}

const DEFAULT_ROOTS = [
  'mite-src/decompile/src/net/minecraft',
  'git-workspace/etim/build/rfg/minecraft-src/java/net/minecraft',
  'git-workspace/etim/build/rfg/minecraft-src/java/net/minecraftforge',
  'git-workspace/etim/src/main/java/io/github/etim/etim',
];
const roots = rootsArg
  ? rootsArg.slice('--roots='.length).split(';').filter(Boolean)
  : DEFAULT_ROOTS;

const SKIP_DIRS = new Set(['.git', 'node_modules', 'logs', 'run', '.gradle', 'caches']);

/* ---------- 1. 字节规格 ---------- */

const buf = fs.readFileSync(file);
const text = buf.toString('utf8');
let utf8Ok = true;
try {
  new TextDecoder('utf-8', { fatal: true }).decode(buf);
} catch (e) {
  utf8Ok = false;
}
const bom = buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
const crlf = (text.match(/\r\n/g) || []).length;
const loneCr = (text.match(/\r(?!\n)/g) || []).length;
const fffd = (text.match(/\uFFFD/g) || []).length;
const placeholders = [
  ...new Set([...text.matchAll(/<<[A-Z0-9_]{2,}>>|@@[A-Z0-9_]{2,}@@/g)].map((m) => m[0])),
];
const okTick = (text.match(/\u2713/g) || []).length;
const crossTick = (text.match(/\u2717/g) || []).length;
const lines = text.split('\n');

const specFail = [];
if (!utf8Ok) specFail.push('UTF-8 非法字节序列');
if (bom) specFail.push('有 BOM');
if (crlf || loneCr) specFail.push(`有 CR（CRLF=${crlf}, loneCR=${loneCr}）`);
if (fffd) specFail.push(`U+FFFD=${fffd}`);
if (placeholders.length) specFail.push(`残留占位符 ${placeholders.join(',')}`);
if (buf[0] !== 0x23 && buf[0] !== 0x2d) specFail.push(`首字节 0x${buf[0].toString(16)}（期望 0x23 '#' 或 0x2d '-'）`);

/* ---------- 2. 锚点索引 ---------- */

const index = new Map(); // basename -> [abs path]
function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p);
    } else if (e.name.endsWith('.java')) {
      const arr = index.get(e.name) || [];
      arr.push(p);
      index.set(e.name, arr);
    }
  }
}
for (const r of roots) {
  const abs = path.resolve(process.cwd(), r);
  if (fs.existsSync(abs)) walk(abs);
}

const lineCountCache = new Map();
function lineCount(p) {
  if (!lineCountCache.has(p)) {
    lineCountCache.set(p, fs.readFileSync(p, 'utf8').split(/\r?\n/).length);
  }
  return lineCountCache.get(p);
}

const norm = (p) => p.replace(/\\/g, '/');
const anchorRe = /([A-Za-z0-9_]+(?:\/[A-Za-z0-9_]+)*\.java):(\d+)/g;
const anchors = new Set();
let m;
while ((m = anchorRe.exec(text))) anchors.add(m[1] + ':' + m[2]);

const anchorFail = [];
for (const a of anchors) {
  const [name, nStr] = [a.slice(0, a.lastIndexOf(':')), a.slice(a.lastIndexOf(':') + 1)];
  const base = name.slice(name.lastIndexOf('/') + 1);
  const dirPart = name.includes('/') ? name.slice(0, name.lastIndexOf('/')) : '';
  const cands = index.get(base) || [];
  if (!cands.length) {
    anchorFail.push(`${a}  ← 全树无此文件`);
    continue;
  }
  let pool = cands;
  if (dirPart) {
    const suffix = '/' + norm(dirPart) + '/' + base;
    const filtered = cands.filter((p) => norm(p).endsWith(suffix));
    if (filtered.length) pool = filtered;
  }
  const n = parseInt(nStr, 10);
  const ok = pool.some((p) => n >= 1 && n <= lineCount(p));
  if (!ok) {
    const max = Math.max(...pool.map(lineCount));
    anchorFail.push(`${a}  ← 行号越界（该文件 ${max} 行）`);
  }
}

/* ---------- 3. 表格完整性 ---------- */

const unescapedPipes = (s) => (s.match(/(?<!\\)\|/g) || []).length;
const tables = [];
let cur = null;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('|')) {
    if (!cur) cur = { start: i + 1, rows: [] };
    cur.rows.push({ n: i + 1, text: lines[i] });
  } else if (cur) {
    tables.push(cur);
    cur = null;
  }
}
if (cur) tables.push(cur);

const tableFail = [];
for (const t of tables) {
  const head = unescapedPipes(t.rows[0].text);
  for (const row of t.rows) {
    const c = unescapedPipes(row.text);
    if (c !== head) {
      tableFail.push(
        `表@${t.start} 行 ${row.n}：cell=${c - 1}，期望 ${head - 1}｜${row.text.slice(0, 64)}`
      );
    }
  }
}

/* ---------- 4/5. 面数与分级计数 ---------- */

const faces = {};
for (const ln of lines) {
  const fm = /^\|\s*M(\d+)-(\d+)\s*\|/.exec(ln);
  if (fm) faces[fm[1]] = (faces[fm[1]] || 0) + 1;
}
const faceTotal = Object.values(faces).reduce((a, b) => a + b, 0);
const countPrefix = (p) => lines.filter((l) => new RegExp('^\\|\\s*' + p + '-(\\d+)\\s*\\|').test(l)).length;
const grades = { A: countPrefix('A'), B: countPrefix('B'), C: countPrefix('C'), D: countPrefix('D') };

/* ---------- 输出 ---------- */

const P = (s) => !quiet && console.log(s);
P('file      : ' + file);
P('bytes     : ' + buf.length);
P('lines     : ' + lines.length);
P('firstByte : 0x' + (buf[0] === undefined ? '??' : buf[0].toString(16)));
P('utf8/bom  : ' + (utf8Ok ? 'ok' : 'INVALID') + ' / ' + (bom ? 'BOM' : 'none'));
P('cr/fffd   : ' + (crlf + loneCr) + ' / ' + fffd);
P('tick/cross: ' + okTick + ' / ' + crossTick);
P('anchors   : ' + anchors.size + ' (missing ' + anchorFail.length + ')');
P('tables    : ' + tables.length + ' (bad rows ' + tableFail.length + ')');
P('faces     : ' + faceTotal + ' ' + JSON.stringify(faces));
P('grades    : A' + grades.A + ' B' + grades.B + ' C' + grades.C + ' D' + grades.D);

if (anchorFail.length) {
  console.error('\n[FAIL] 锚点：');
  anchorFail.forEach((x) => console.error('  ' + x));
}
if (tableFail.length) {
  console.error('\n[FAIL] 表格：');
  tableFail.forEach((x) => console.error('  ' + x));
}
if (specFail.length) {
  console.error('\n[FAIL] 字节规格：');
  specFail.forEach((x) => console.error('  ' + x));
}

const failed = anchorFail.length || tableFail.length || specFail.length;
console.log(failed ? '\nFAIL: ' + (anchorFail.length + tableFail.length + specFail.length) + ' 项' : '\nOK');
process.exit(failed ? 1 : 0);
