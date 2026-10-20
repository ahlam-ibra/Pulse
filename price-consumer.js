import amqp from 'amqplib';

const url = process.env.RABBITMQ_URL ?? 'amqp://localhost';
const priceUpdatesQueue = process.env.PRICE_UPDATES_QUEUE ?? 'price.updates';

const connection = await amqp.connect(url);
const channel = await connection.createChannel();

await channel.assertQueue(priceUpdatesQueue, { durable: true });
console.log(`[*] Listening for price updates on '${priceUpdatesQueue}'`);

channel.consume(priceUpdatesQueue, (msg) => {
  if (msg === null) return;
  console.log(`[x] Received price update ${msg.content.toString()}`);
  channel.ack(msg);
});

process.on('SIGINT', async () => {
  await channel.close();
  await connection.close();
  process.exit(0);
});
