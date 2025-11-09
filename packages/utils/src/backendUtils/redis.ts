import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is required');
}

export const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => logger.info('Redis connected'));
redis.on('ready', () => logger.info('Redis ready'));
redis.on('error', (err) => logger.error('Redis error', err));
redis.on('close', () => logger.warn('Redis connection closed'));
redis.on('reconnecting', () => logger.info('Redis reconnecting...'));

// Graceful shutdown
const shutdownRedis = async () => {
  await redis.quit();
  logger.info('Redis disconnected');
};

process.on('SIGINT', shutdownRedis);
process.on('SIGTERM', shutdownRedis);