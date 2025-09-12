import type { Request, Response } from "express";
import { prisma } from "../db/index";
import {
	createProductSchema,
	updateProductSchema,
} from "../validation/product.validation";
import jwt from "jsonwebtoken";

export const getProducts = async (req: Request, res: Response) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const skip = (page - 1) * limit;
		const search = (req.query.search as string) || "";

		const sortBy =
			(req.query.sortBy as string) ||
			("createdAt" as keyof typeof prisma.product);
		const order = (req.query.order as string) || ("desc" as "asc" | "desc");
		const products = await prisma.product.findMany({
			where: {
				name: {
					contains: search,
					mode: "insensitive",
				},
			},
			include: {
				variants: true,
				reviews: true,
			},
			skip,
			take: limit,
			orderBy: { [sortBy]: order },
		});

		const total = await prisma.product.count({
			where: { name: { contains: search, mode: "insensitive" } },
		});

		res.status(200).json({
			data: products,
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
		const parsed = createProductSchema.safeParse(req.body);

		if (!parsed.success) {
			res.status(400).json({ message: "Validation error" });
			return;
		}
		const product = await prisma.product.create({
			data: {
				name: parsed.data.name,
				description: parsed.data.description,
				price: parsed.data.price,
				discount: parsed.data.discount,
				variants: {
					createMany: {
						data: parsed.data.variants.map((variant) => {
							return {
								color: variant.color,
								image: variant.image,
								stock: variant.stock,
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
					userId: req.user.id,
					productVariant: {
						productId: product.id,
					},
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
