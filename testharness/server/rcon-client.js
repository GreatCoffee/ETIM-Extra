/**
 * rcon-client.js — one-shot RCON client (ETIM-Extra harness)
 *
 * usage: node rcon-client.js [host] [port] [pass] "<command>"
 * default 127.0.0.1 25575 etim27
 *
 * KNOWN VANILLA 1.12.2 DEFECT (found 2026-10-28, logged as B-EXTRA-2):
 * RConThreadClient.run() wraps the whole loop body in try/finally and calls
 * closeSocket() in the finally — every `continue` after a packet (auth OR
 * exec) closes the socket and nulls clientSocket. The next loop iteration
 * NPEs at the read, so a connection can carry exactly ONE packet. Auth and
 * exec cannot ride the same connection, and a fresh connection has
 * loggedIn=false. Consequence: stock 1.12.2 RCON cannot run a command; the
 * main project's chain solves it with a binpatch of RConThreadClient.
 * This client is kept for chains that carry that patch.
 */
'use strict';
const net = require('net');

const HOST = process.argv[2] || '127.0.0.1';
const PORT = Number(process.argv[3] || 25575);
const PASS = process.argv[4] || 'etim27';
const CMD = process.argv[5];

if (!CMD) {
  console.error('usage: node rcon-client.js [host] [port] [pass] "command"');
  process.exit(2);
}

function packet(id, type, body) {
  const bytes = Buffer.from(body, 'utf8');
  const payload = Buffer.alloc(10 + bytes.length);
  payload.writeInt32LE(id, 0);
  payload.writeInt32LE(type, 4);
  bytes.copy(payload, 8);
  payload.writeUInt8(0, 8 + bytes.length);
  payload.writeUInt8(0, 9 + bytes.length);
  const out = Buffer.alloc(4 + payload.length);
  out.writeInt32LE(payload.length, 0);
  payload.copy(out, 4);
  return out;
}

const sock = net.connect(PORT, HOST);
const timer = setTimeout(() => {
  console.error('rcon: timeout');
  process.exit(3);
}, 10000);

sock.on('error', (e) => {
  console.error('rcon: ' + e.message);
  process.exit(3);
});

sock.on('connect', () => sock.write(packet(1, 3, PASS)));

let buf = Buffer.alloc(0);
let authed = false;

sock.on('data', (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  while (buf.length >= 4) {
    const len = buf.readInt32LE(0);
    if (buf.length < 4 + len) return;
    const body = buf.slice(12, 4 + len - 2).toString('utf8');
    buf = buf.slice(4 + len);
    if (!authed) {
      authed = true;
      sock.write(packet(2, 2, CMD));
    } else {
      process.stdout.write(body);
      clearTimeout(timer);
      sock.end();
    }
  }
});
