import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is required');
}

export const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => console.log('Redis connected'));
redis.on('ready', () => console.log('Redis ready'));
redis.on('error', (err) => console.log('Redis error', err));
redis.on('close', () => console.log('Redis connection closed'));

// Graceful shutdown
const shutdownRedis = async () => {
  await redis.quit();
  console.log('Redis disconnected');
};

process.on('SIGINT', shutdownRedis);
process.on('SIGTERM', shutdownRedis);
