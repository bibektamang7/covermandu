import type { Request, Response } from "express";
import { prisma } from "db";
import { createReviewSchema } from "../validation/review.validation";
import redis from "../utils/redis";

export const createReview = async (req: Request, res: Response) => {
	try {
		const parsed = createReviewSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({ message: "Validation error" });
			return;
		}
		const { message, productId, stars } = parsed.data;
		const review = await prisma.review.create({
			data: { message, productId, reviewerId: req.user.id, stars },
		});
		if (!review) {
			res.status(400).json({ message: "Failed to create review" });
			return;
		}
		
		// Invalidate reviews cache for this product and recommended products cache
		await Promise.all([
			redis.del(`reviews:${productId}:*`),
			redis.del("recommended:*")
		]);
		
		res.status(200).json({
			message: "Review created successfully",
			review,
		});
	} catch (error: any) {
		console.error("Failed to create review", error);
		if (error.code === "P2003") {
			res.status(400).json({ message: "Invalid product" });
			return;
		}
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getReviewsByProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;
		if (!productId) {
			res.status(400).json({ message: "Product ID is required" });
			return;
		}

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
	} catch (error: any) {
		console.error("Failed to get reviews", error);
		if (error.code === "P2023") {
			res.status(400).json({ message: "Invalid product ID" });
			return;
		}
		res.status(500).json({ message: "Internal server error" });
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
		console.error("Failed to get user reviews", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
