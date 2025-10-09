import type { Request, Response } from "express";
import { prisma } from "db";
import { createReviewSchema } from "../validation/review.validation";
import redis from "../utils/redis";
import { CustomError } from "../utils/CustomError";

export const createReview = async (req: Request, res: Response) => {
	const parsed = createReviewSchema.safeParse(req.body);
	if (!parsed.success) {
		throw new CustomError(400, "Validation error", "", [parsed.error.message]);
	}
	const { message, productId, stars } = parsed.data;
	try {
		const review = await prisma.review.create({
			data: { message, productId, reviewerId: req.user.id, stars },
		});
		if (!review) {
			throw new CustomError(400, "Failed to create review");
		}

		// Invalidate reviews cache for this product and recommended products cache
		await Promise.all([
			redis.del(`reviews:${productId}:*`),
			redis.del("recommended:*"),
		]);

		res.status(200).json({
			message: "Review created successfully",
			review,
		});
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const getReviewsByProduct = async (req: Request, res: Response) => {
	const { productId } = req.params;
	if (!productId) {
		throw new CustomError(400, "Product ID is required");
	}

	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		// Create cache key for reviews
		const cacheKey = `reviews:${productId}:${page}:${limit}`;

		// Try to get cached reviews
		const cachedReviews = await redis.get(cacheKey);
		if (cachedReviews) {
			return res.status(200).json(JSON.parse(cachedReviews));
		}

		const reviews = await prisma.review.findMany({
			where: { productId },
			include: { reviewer: true },
			skip,
			take: limit,
		});

		// Cache the reviews for 10 minutes (600 seconds)
		await redis.setex(cacheKey, 600, JSON.stringify(reviews));

		res.status(200).json(reviews);
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const getUserReviews = async (req: Request, res: Response) => {
	try {
		const reviews = await prisma.review.findMany({
			where: { reviewerId: req.user.id },
			include: { product: true },
		});
		res.status(200).json(reviews);
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};
