import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("error", (err) => {
	console.error("Redis error:", err);
});
redis.on("connect", () => {
	console.log("Connected to Redis");
});

redis.on("ready", () => {
	console.log("Redis is ready");
});

redis.on("close", () => {
	console.log("Redis connection closed");
});

process.on('SIGINT', () => {
    redis.quit().then(() => {
        console.log('Redis client quit.');
        process.exit();
    });
});

export default redis;
