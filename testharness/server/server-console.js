/**
 * server-console.js — ETIM-Extra 验证窗服务端控制面（会话七工装）
 *
 * 为什么不用 RCON：stock 1.12.2 `RConThreadClient` 每轮 loop 结束即关 socket，
 * 一条连接只能承载一个包，auth 与 exec 无法同连接（B-EXTRA-2，2026-10-28）。
 * 本项目 run 目录未挂主项目的 RConThreadClient binpatch，故 RCON 不可用；
 * 唯一优雅通道是**控制台 stdin**。
 *
 * 本模块把 `gradlew runServer` 拉起来，保留 stdin 管道，供窗口脚本按时间轴
 * 逐条下发服务器命令；同时把 gradle + 服务器输出全量 tee 到
 * `testharness/build-logs/<tag>.out`，并按行喂给监听者做判定解析。
 *
 * 用法：
 *   const { startServer } = require('./server-console');
 *   const srv = await startServer({ root, tag: '12-shield-verdict-server' });
 *   srv.send('say phase=A');     // 一行 = 一条服务器命令
 *   await srv.stop();            // 下发 stop 并等 Saving worlds / 进程退出
 */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const JDK25 = 'C:\\Users\\GreatCoffee\\tools\\jdk-25.0.4.1+1';

function startServer(opts) {
  const root = opts.root;
  const tag = opts.tag || 'server';
  const jdkHome = opts.jdkHome || JDK25;
  const outDir = path.join(root, 'testharness', 'build-logs');
  fs.mkdirSync(outDir, { recursive: true });
  const logPath = path.join(outDir, tag + '.out');
  const out = fs.createWriteStream(logPath, { flags: 'w' });

  const child = spawn('cmd.exe', ['/d', '/s', '/c', 'gradlew.bat runServer --console=plain'], {
    cwd: root,
    env: Object.assign({}, process.env, { JAVA_HOME: jdkHome }),
    windowsHide: true,
  });

  const listeners = new Set();
  const all = [];
  let tail = '';
  const feed = (chunk) => {
    out.write(chunk);
    tail += chunk.toString('utf8');
    let i;
    while ((i = tail.indexOf('\n')) >= 0) {
      const line = tail.slice(0, i).replace(/\r$/, '');
      tail = tail.slice(i + 1);
      all.push(line);
      for (const fn of listeners) {
        try { fn(line); } catch (e) { /* listener errors never kill the window */ }
      }
    }
  };
  child.stdout.on('data', feed);
  child.stderr.on('data', feed);

  let exited = false;
  let exitCode = null;
  const exitPromise = new Promise((resolve) => {
    child.on('close', (code) => { exited = true; exitCode = code; resolve(code); });
  });

  const waitFor = (re, timeoutMs, fromIndex = 0) => new Promise((resolve) => {
    for (let i = fromIndex; i < all.length; i++) {
      if (re.test(all[i])) return resolve(all[i]);
    }
    let timer = null;
    const fn = (line) => {
      if (re.test(line)) { clearTimeout(timer); listeners.delete(fn); resolve(line); }
    };
    timer = setTimeout(() => { listeners.delete(fn); resolve(null); }, timeoutMs);
    listeners.add(fn);
  });

  const send = (line) => {
    if (exited) throw new Error('server already exited (code ' + exitCode + ')');
    out.write('### [harness] > ' + line + '\n');
    child.stdin.write(line + '\n');
    return line;
  };

  const ready = waitFor(/Done \(/, 300000);

  async function stop(timeoutMs = 120000) {
    if (!exited) {
      try { send('stop'); } catch (e) { /* already gone */ }
      await Promise.race([
        waitFor(/Saving worlds/, 30000),
        exitPromise,
      ]);
    }
    await Promise.race([exitPromise, new Promise((r) => setTimeout(r, timeoutMs))]);
    out.end();
    return { exitCode, exited };
  }

  return { child, logPath, send, waitFor, stop, ready, all, exitPromise, get exited() { return exited; } };
}

module.exports = { startServer, JDK25 };
