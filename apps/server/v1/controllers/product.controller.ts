import type { Request, Response } from "express";
import { prisma, PhoneModel, Category } from "db";
import {
	createProductSchema,
	updateProductSchema,
} from "../validation/product.validation";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import redis from "../utils/redis";
import { CustomError } from "../utils/CustomError";

const categoryLabels: Record<Category, string> = {
	[Category.SLIM_CASE]: "slim case",
	[Category.CLEAR_CASE]: "clear case",
	[Category.RUGGED_CASE]: "rugged case",
	[Category.SILICONE_CASE]: "silicone case",
	[Category.LEATHER_CASE]: "leather case",
	[Category.WOODEN_CASE]: "wooden case",
	[Category.WALLET_CASE]: "wallet case",
	[Category.STAND_CASE]: "stand case",
	[Category.MAGSAFE_COMPATIBLE]: "magsafe compatible",
	[Category.FLIP_CASE]: "flip case",
};

const phoneModelLabels: Record<PhoneModel, string> = {
	[PhoneModel.IPHONE_15]: "iphone 15",
	[PhoneModel.IPHONE_15_PRO]: "iphone 15 pro",
	[PhoneModel.IPHONE_15_PRO_MAX]: "iphone 15 pro max",
	[PhoneModel.IPHONE_14]: "iphone 14",
	[PhoneModel.IPHONE_14_PRO]: "iphone 14 pro",
	[PhoneModel.IPHONE_14_PRO_MAX]: "iphone 14 pro max",
};

function findMatchingCategories(search: string): Category[] {
	return Object.entries(categoryLabels)
		.filter(([_, label]) => label.includes(search))
		.map(([enumValue]) => enumValue as Category);
}

function findMatchingPhoneModels(search: string): PhoneModel[] {
	return Object.entries(phoneModelLabels)
		.filter(([_, label]) => label.includes(search))
		.map(([enumValue]) => enumValue as PhoneModel);
}

function generateCacheKey(params: Record<string, any>) {
	const keyString = JSON.stringify(params);
	return `products:${crypto.createHash("md5").update(keyString).digest("hex")}`;
}

export const getProducts = async (req: Request, res: Response) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 12;
		const skip = (page - 1) * limit;

		const search = (req.query.search as string) || "";
		const category = (req.query.category as string) || "";
		const phoneModel = (req.query.phoneModel as string) || "";

		const sortBy = (req.query.sortBy as string) || "createdAt";
		const order = (req.query.order as "asc" | "desc") || "desc";

		// Generate hashed cache key
		const cacheKey = generateCacheKey({
			page,
			limit,
			search,
			category,
			phoneModel,
			sortBy,
			order,
		});

		// Try to get cached data
		const cachedData = await redis.get(cacheKey);
		if (cachedData) {
			return res.status(200).json(JSON.parse(cachedData));
		}

		const whereConditions: any = {};
		if (search) {
			const categories = findMatchingCategories(search);
			const phoneModels = findMatchingPhoneModels(search);

			whereConditions.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				...(categories.length ? [{ category: { in: categories } }] : []),
				...(phoneModels.length ? [{ phoneModel: { in: phoneModels } }] : []),
			];
		} else {
			if (category) {
				whereConditions.category = category.toUpperCase();
			}

			if (phoneModel) {
				whereConditions.phoneModel = phoneModel.toUpperCase();
			}
		}

		let orderBy: any = { [sortBy]: order };

		if (sortBy === "reviews") {
			orderBy = { createdAt: order };
		}

		const products = await prisma.product.findMany({
			where: whereConditions,
			include: {
				reviews: {
					select: {
						stars: true,
					},
				},
				variants: {
					take: 1,
				},
			},
			skip,
			take: limit,
			orderBy,
		});

		const productsWithAvgRating = products.map((product) => {
			const totalReviews = product.reviews.length;
			const totalStars = product.reviews.reduce(
				(sum, review) => sum + review.stars,
				0
			);
			const avgStars = totalReviews > 0 ? totalStars / totalReviews : 0;

			const { reviews, ...productWithoutReviews } = product;

			return {
				...productWithoutReviews,
				avgStars: parseFloat(avgStars.toFixed(2)),
				reviewCount: totalReviews,
			};
		});

		const total = await prisma.product.count({
			where: whereConditions,
		});

		const responseData = {
			products: productsWithAvgRating,
			page,
			totalPages: Math.ceil(total / limit),
			total,
		};

		await redis.set(cacheKey, JSON.stringify(responseData), "EX", 600);

		res.status(200).json(responseData);
	} catch (error) {
		throw error;
	}
};

const generateSKU = (): string => {
	const prefix = Math.floor(Math.random() * 1e9); 
	const suffix = Math.floor(Math.random() * 1e9);
	return `${prefix}_NP-${suffix}`;
};

export const createProduct = async (req: Request, res: Response) => {
	try {
		const parsed = createProductSchema.safeParse({
			...req.body,
			price: parseInt(req.body.price, 10),
		});

		if (!parsed.success) {
			console.log("this is error", parsed.error.message);
			throw new CustomError(400, "Validation error", "", [
				parsed.error.message,
			]);
		}
		const product = await prisma.product.create({
			data: {
				name: parsed.data.name,
				description: parsed.data.description,
				price: parsed.data.price,
				discount: parsed.data.discount,
				availableModel: parsed.data.availableModel,
				tag: parsed.data.tag,
				category: parsed.data.category,
				variants: {
					createMany: {
						data: parsed.data.variants.map((variant) => {
							return {
								color: variant.color,
								image: variant.image,
								stock: variant.stock,
								phoneModel: variant.phoneModel,
								sku: generateSKU(),
							};
						}),
					},
				},
			},
		});

		if (!product) {
			throw new CustomError(400, "Failed to create product");
		}

		// Invalidate products cache when a new product is created
		await Promise.all([redis.del("products:*"), redis.del("recommended:*")]);

		res.status(200).json({ message: "Product created successfully" });
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;

		if (!productId) {
			throw new CustomError(400, "Product ID is required");
		}
		const product = await prisma.product.delete({
			where: { id: productId },
		});

		if (!product) {
			throw new CustomError(400, "Failed to delete product");
		}

		// Invalidate product and products cache when a product is deleted
		await Promise.all([
			redis.del(`product:${productId}`),
			redis.del("products:*"),
			redis.del("recommended:*"),
		]);

		res.status(200).json({ message: "Product deleted" });
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const getProductById = async (req: Request, res: Response) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		let user;
		if (token) {
			const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
			user = await prisma.user.findUnique({
				where: { id: (decoded as any).id },
			});
		}

		const { productId } = req.params;

		if (!productId) {
			throw new CustomError(400, "Product ID is required");
		}

		const product = await prisma.product.findUnique({
			where: { id: productId },
			include: {
				variants: true,
				reviews: { take: 5, orderBy: { createdAt: "desc" } },
			},
		});
		if (!product) {
			throw new CustomError(404, "Product not found");
		}

		let isWishlisted = false;
		if (user && user.id) {
			const wishlistedVariant = await prisma.wishlist.findFirst({
				where: {
					userId: user.id,
					productId: product.id,
				},
				select: { id: true },
			});
			isWishlisted = !!wishlistedVariant;
		}

		res.status(200).json({ product, isWishlisted });
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;
		if (!productId) {
			throw new CustomError(400, "Product ID is required");
		}
		const parsed = updateProductSchema.safeParse(req.body);
		if (!parsed.success) {
			throw new CustomError(400, "Validation error", "", [
				parsed.error.message,
			]);
		}

		const updatedProduct = await prisma.product.update({
			where: { id: productId },
			data: parsed.data,
		});
		if (!updatedProduct) {
			throw new CustomError(400, "Failed to update product");
		}

		// Invalidate product and products cache when a product is updated
		await Promise.all([
			redis.del(`product:${productId}`),
			redis.del("products:*"),
			redis.del("recommended:*"),
		]);

		res.status(200).json({ message: "Product updated successfully" });
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const getRecommendedProducts = async (req: Request, res: Response) => {
	try {
		const [cartItems, wishlistItems, pastReviews] = await Promise.all([
			prisma.cart.findMany({
				where: { userId: req.user.id },
				include: {
					productVariant: {
						include: {
							Product: true,
						},
					},
				},
			}),
			prisma.wishlist.findMany({
				where: { userId: req.user.id },
				include: {
					product: {
						include: {
							variants: true,
						},
					},
				},
			}),
			prisma.review.findMany({
				where: { reviewerId: req.user.id },
				include: {
					product: {
						include: {
							variants: true,
						},
					},
				},
			}),
		]);

		const hasInteractions =
			cartItems.length > 0 ||
			wishlistItems.length > 0 ||
			pastReviews.length > 0;

		if (!hasInteractions) {
			const randomProducts = await prisma.product.findMany({
				include: {
					variants: true,
					reviews: true,
				},
				orderBy: { createdAt: "desc" },
				take: 12,
			});

			const responseData = {
				products: randomProducts,
				total: randomProducts.length,
				message: "Random products returned as no past interactions were found",
			};

			res.status(200).json(responseData);
			return;
		}

		const userCategories = new Set<Category>();
		const userPhoneModels = new Set<PhoneModel>();
		const interactionProductIds = new Set<string>();

		cartItems.forEach((item) => {
			if (item.productVariant?.Product) {
				userCategories.add(item.productVariant.Product.category);
				userPhoneModels.add(item.productVariant.phoneModel);
				interactionProductIds.add(item.productVariant.Product.id);
			}
		});

		wishlistItems.forEach((item) => {
			if (item.product) {
				userCategories.add(item.product.category);
				item.product.variants.forEach((variant) => {
					userPhoneModels.add(variant.phoneModel);
				});
				interactionProductIds.add(item.productId);
			}
		});

		pastReviews.forEach((review) => {
			if (review.product) {
				userCategories.add(review.product.category);
				review.product.variants.forEach((variant) => {
					userPhoneModels.add(variant.phoneModel);
				});
				interactionProductIds.add(review.productId);
			}
		});

		// Generate recommendations based on user preferences
		const recommendations = await prisma.product.findMany({
			where: {
				id: { notIn: Array.from(interactionProductIds) },
				OR: [
					{ category: { in: Array.from(userCategories) } },
					{
						variants: {
							some: { phoneModel: { in: Array.from(userPhoneModels) } },
						},
					},
				],
			},
			include: {
				variants: true,
				reviews: true,
			},
			orderBy: {
				reviews: {
					_count: "desc",
				},
			},
			take: 12,
		});

		const responseData = {
			products: recommendations,
			total: recommendations.length,
			message: "Recommended products fetched successfully",
		};

		res.status(200).json(responseData);
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};
