'use strict';
// raw RCON probe: print every byte the server sends back
const net = require('net');
const s = net.connect(25575, '127.0.0.1');
s.on('connect', () => {
  console.log('connected');
  const body = 'etim27';
  const payload = Buffer.alloc(10 + body.length);
  payload.writeInt32LE(1, 0);
  payload.writeInt32LE(3, 4);
  Buffer.from(body).copy(payload, 8);
  const out = Buffer.alloc(4 + payload.length);
  out.writeInt32LE(payload.length, 0);
  payload.copy(out, 4);
  console.log('send ' + out.toString('hex'));
  s.write(out);
});
s.on('data', (d) => console.log('recv ' + d.toString('hex')));
s.on('close', () => { console.log('closed'); process.exit(0); });
s.on('error', (e) => { console.log('err ' + e.message); process.exit(1); });
setTimeout(() => { console.log('timeout'); s.destroy(); process.exit(0); }, 5000);
