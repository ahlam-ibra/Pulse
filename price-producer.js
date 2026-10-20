import amqp from 'amqplib';

const url = process.env.RABBITMQ_URL;
const priceUpdatesQueue = process.env.PRICE_UPDATES_QUEUE;
const priceUpdate = process.argv[2] ?? JSON.stringify({ symbol: 'BTC-USD', price: 67250 });

const connection = await amqp.connect(url);
const channel = await connection.createChannel();

await channel.assertQueue(priceUpdatesQueue, { durable: true });
channel.sendToQueue(priceUpdatesQueue, Buffer.from(priceUpdate), {
  persistent: true,
  contentType: 'application/json',
});
console.log(`[x] Published price update ${priceUpdate}`);

await channel.close();
await connection.close();
