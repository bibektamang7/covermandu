import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "./redis";
import type { Request, Response, NextFunction } from "express";
import { CustomError } from "./CustomError";

const globalRateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "global_limit",
	points: 100,
	duration: 60,
	blockDuration: 60 * 5,
	inMemoryBlockOnConsumed: 150,
	inMemoryBlockDuration: 10,
});

const loginRateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "login_limit",
	points: 5,
	duration: 900,
	blockDuration: 1800,
	inMemoryBlockOnConsumed: 10,
	inMemoryBlockDuration: 300,
});

const getRateLimitKey = (req: Request): string => {
	const xForwardedFor = req.headers["x-forwarded-for"];
	let ipFromXForwarded: string | undefined;

	if (xForwardedFor && typeof xForwardedFor === "string") {
		ipFromXForwarded = xForwardedFor.split(",")[0]?.trim();
	} else if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
		ipFromXForwarded = xForwardedFor[0]?.split(",")[0]?.trim();
	}

	const key =
		(req.headers["cf-connecting-ip"] as string) ||
		ipFromXForwarded ||
		req.ip ||
		"unknown";

	return key;
};

export const globalRateLimiterMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let key = getRateLimitKey(req);
	if (key === "unknown") {
		key = crypto.randomUUID();
	}
	globalRateLimiter
		.consume(key, 1)
		.then(() => {
			next();
		})
		.catch(() => {
			throw new CustomError(429, "Too Many Requests");
		});
};

export const loginRateLimiterMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let key = getRateLimitKey(req);
	if (key === "unknown") {
		key = req.body.email;
	}
	loginRateLimiter
		.consume(key, 1)
		.then(() => {
			console.log("is this even here");
			next();
		})
		.catch(() => {
			throw new CustomError(429, "Too Many Requests");
		});
};

const registerRateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "register_limit",
	points: 5,
	duration: 60 * 60,
	blockDuration: 60 * 60 * 24,
});

export const registerRateLimiterMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let key = getRateLimitKey(req);
	if (key === "unknown") {
		key = req.body.email;
	}
	registerRateLimiter
		.consume(key, 1)
		.then(() => {
			next();
		})
		.catch(() => {
			throw new CustomError(429, "Too Many Requests");
		});
};
