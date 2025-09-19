import type { Request, Response } from "express";
import { prisma, PhoneModel, Category } from "db";
import {
	createProductSchema,
	updateProductSchema,
} from "../validation/product.validation";
import jwt from "jsonwebtoken";

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

		const whereConditions: any = {};
		const normalizeSearch = search.toLowerCase().trim();

		if (search) {
			const categories = findMatchingCategories(search);
			const phoneModels = findMatchingPhoneModels(search);

			whereConditions.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				...(categories.length ? [{ category: { in: categories } }] : []),
				...(phoneModels.length ? [{ phoneModel: { in: phoneModels } }] : []),
			];
		}

		if (category && !search) {
			whereConditions.category = category.toUpperCase();
		}

		if (phoneModel && !search) {
			whereConditions.phoneModel = phoneModel.toUpperCase();
		}

		let orderBy: any = { [sortBy]: order };

		if (sortBy === "reviews") {
			orderBy = { createdAt: order };
		}

		const products = await prisma.product.findMany({
			where: whereConditions,
			include: {
				variants: true,
				reviews: true,
			},
			skip,
			take: limit,
			orderBy,
		});

		const total = await prisma.product.count({
			where: whereConditions,
		});

		res.status(200).json({
			products,
			page,
			totalPages: Math.ceil(total / limit),
			total,
		});
	} catch (error) {
		console.error("Failed to get products", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const generateSKU = (): string => {
	const prefix = Math.floor(Math.random() * 1e9); //9 digit random
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
			res.status(400).json({ message: "Validation error" });
			return;
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
			res.status(400).json({ message: "Failed to create product" });
			return;
		}
		res.status(200).json({ message: "Product created successfully" });
	} catch (error) {
		console.error("Failed to create product", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;

		if (!productId) {
			res.status(400).json({ message: "Product ID is required" });
			return;
		}
		const product = await prisma.product.delete({
			where: { id: productId },
		});

		if (!product) {
			res.status(400).json({ message: "Failed to delete product" });
			return;
		}
		res.status(200).json({ message: "Product deleted" });
	} catch (error) {
		console.error("Failed to delete product", error);
		res.status(500).json({ message: "Internal server error" });
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
			res.status(400).json({ message: "Product ID is required" });
			return;
		}
		const product = await prisma.product.findUnique({
			where: { id: productId },
			include: {
				variants: true,
				reviews: { take: 5, orderBy: { createdAt: "desc" } },
			},
		});
		if (!product) {
			res.status(404).json({ message: "Product not found" });
			return;
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
		console.error("Failed to get product", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;
		if (!productId) {
			res.status(400).json({ message: "Product ID is required" });
			return;
		}
		const parsed = updateProductSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({ message: "Validation error" });
			return;
		}

		const updatedProduct = await prisma.product.update({
			where: { id: productId },
			data: parsed.data,
		});
		if (!updatedProduct) {
			res.status(400).json({ message: "Failed to update product" });
			return;
		}
		res.status(200).json({ message: "Product updated successfully" });
	} catch (error) {
		console.error("Failed to update product", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
