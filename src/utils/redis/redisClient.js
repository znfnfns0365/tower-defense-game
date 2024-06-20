import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  legacyMode: true,
});

client.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

export default client;
