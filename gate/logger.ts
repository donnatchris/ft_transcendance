import * as net from 'net';

const LOGSTASH_HOST = 'logstash';
const LOGSTASH_PORT = 50000;

export function sendLog(message: string) {
  const client = new net.Socket();

  client.connect(LOGSTASH_PORT, LOGSTASH_HOST, () => {
    client.write(`${message}\n`);
    client.end();
  });

  client.on('error', (err) => {
    console.error('Failed to send log to Logstash:', err.message);
  });
}
