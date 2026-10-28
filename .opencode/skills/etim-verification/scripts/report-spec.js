#!/usr/bin/env node
/**
 * report-spec.js — 判决回执字节规格校验与固定点更新。
 *
 * 用法：
 *   node .opencode/skills/etim-verification/scripts/report-spec.js <报告路径> [--dry]
 *
 * 行为：
 *   1. 去 BOM（首字节 0xEF 0xBB 0xBF）、把 CRLF 归一为 LF 后写回；
 *   2. 找 `> **报告字节规格**：` 开头的那一行，迭代重算到自指稳定；
 *   3. 输出字节数 / 行数 / ✓ / ✗ / U+FFFD / CRLF / 残留占位符 / 首字节。
 *
 * 退出码：0 正常；1 有残留占位符或 U+FFFD 或 CRLF（需人工处理）；2 参数缺失。
 * 只做机械核讫，不改正文语义。
 */
'use strict';
const fs = require('fs');

const file = process.argv[2];
const dry = process.argv.includes('--dry');
if (!file) {
  console.error('usage: node report-spec.js <report.md> [--dry]');
  process.exit(2);
}

let t = fs.readFileSync(file, 'utf8');
let bom = 'no';
if (t.charCodeAt(0) === 0xFEFF) {
  bom = 'removed';
  t = t.slice(1);
}
const crlfBefore = (t.match(/\r/g) || []).length;
if (crlfBefore) t = t.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

const specRe = /^> \*\*报告字节规格\*\*：.*$/m;
const hasSpecLine = specRe.test(t);

const count = (txt, re) => (txt.match(re) || []).length;
const fmt = (txt) =>
  `${Buffer.byteLength(txt, 'utf8').toLocaleString('en-US')} B｜UTF-8 无 BOM｜LF｜0 U+FFFD｜` +
  `✓ ${count(txt, /\u2713/g)} / ✗ ${count(txt, /\u2717/g)}｜${txt.split('\n').length} 行`;

let spec = '';
if (hasSpecLine) {
  // 先用「空规格」估个初值，再迭代到自指稳定（最多 40 轮）
  let base = t.replace(specRe, '> **报告字节规格**：``');
  spec = fmt(base);
  for (let i = 0; i < 40; i++) {
    const next = fmt(t.replace(specRe, '> **报告字节规格**：`' + spec + '`'));
    if (next === spec) break;
    spec = next;
  }
  t = t.replace(specRe, '> **报告字节规格**：`' + spec + '`');
}

if (!dry) fs.writeFileSync(file, t, 'utf8');

const placeholders = [...new Set([...t.matchAll(/<<[A-Z0-9_]+>>|@@[A-Z0-9_]+@@/g)].map((m) => m[0]))];
const fffd = count(t, /\uFFFD/g);
const crlf = count(t, /\r/g);
const chk = count(t, /\u2713/g);
const cro = count(t, /\u2717/g);

console.log(`file      : ${file}`);
console.log(`bom       : ${bom}${crlfBefore ? ` (CRLF normalized: ${crlfBefore})` : ''}`);
console.log(`bytes     : ${Buffer.byteLength(t, 'utf8')}`);
console.log(`lines     : ${t.split('\n').length}`);
console.log(`firstByte : 0x${t.charCodeAt(0).toString(16)}`);
console.log(`check/cross: ${chk} / ${cro}`);
console.log(`U+FFFD    : ${fffd}`);
console.log(`CR count  : ${crlf}`);
console.log(`leftover  : ${placeholders.join(',') || 'none'}`);
console.log(`specLine  : ${hasSpecLine ? spec : '(not found — 模板未用固定点行)'}`);

if (placeholders.length || fffd || crlf) {
  console.error('FAIL: 仍有占位符 / U+FFFD / CR，需处理后重跑');
  process.exit(1);
}
console.log('OK');
