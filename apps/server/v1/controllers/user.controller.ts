import type { Request, Response } from "express";
import { prisma } from "db";
import {
	loginUserSchema,
	registerUserSchema,
} from "../validation/user.validation";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const loginUser = async (req: Request, res: Response) => {
	try {
		const parsed = loginUserSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({ message: "Validation error" });
			return;
		}
		const { email, googleId } = parsed.data;
		const user = await prisma.user.findUnique({
			where: { email, googleId },
		});
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}
		const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET!, {
			expiresIn: "7d",
		});
		const options = {
			secure: false,
			httpOnly: true,
			maxAge: 60 * 60 * 60 * 24 * 7,
		};

		res.cookie("access_token", token, options);
		res.status(200).json({ user, token });
	} catch (error) {
		console.error("Failed to login user", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const registerUser = async (req: Request, res: Response) => {
	console.log("is it here or not in register");
	try {
		const parsed = registerUserSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({ message: "Validation error" });
			return;
		}
		const { name, image, googleId, email } = parsed.data;
		const existingUser = await prisma.user.findUnique({
			where: { email, googleId },
		});
		if (existingUser) {
			res.status(400).json({ message: "User already exists" });
			return;
		}
		const user = await prisma.user.create({
			data: {
				name,
				email,
				image,
				googleId,
				role: process.env.ADMIN_EMAIL?.includes(email) ? "ADMIN" : "USER",
			},
		});
		if (!user) {
			res.status(400).json({ message: "Failed to create user" });
			return;
		}

		const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET!, {
			expiresIn: "7d",
		});

		const options = {
			secure: false,
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
		};

		res.cookie("access_token", token, options);
		res.status(200).json({ user, token });
	} catch (error) {
		console.error("Failed to register user", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getSignedUrl = async (req: Request, res: Response) => {
	try {
		const token = crypto.randomBytes(16).toString("hex");
		const expire = Math.floor(Date.now() / 1000) + 120;
		const signature = crypto
			.createHmac("sha1", process.env.IMAGEKIT_PRIVATE_KEY!)
			.update(token + expire)
			.digest("hex");

		res.status(200).json({
			token,
			expire,
			signature,
			publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
			// uploadEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
		});
	} catch (error) {
		console.error("Error generating upload signature: ", error);
		res.send(500).json({ message: "Failed to generate upload signature" });
	}
};

export const getUser = (req: Request, res: Response) => {
	res.status(200).json({ user: req.user });
};

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
				image: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		
		res.status(200).json({ users });
	} catch (error) {
		console.error("Failed to fetch users", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getUserDashboard = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		
		// Get user data
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				createdAt: true,
			},
		});
		
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		
		// Get cart items count
		const cartItemsCount = await prisma.cart.count({
			where: { userId: userId },
		});
		
		// Get wishlist items count
		const wishlistItemsCount = await prisma.wishlist.count({
			where: { userId: userId },
		});
		
		// Get user reviews count
		const reviewsCount = await prisma.review.count({
			where: { reviewerId: userId },
		});
		
		// Get recent cart items (as orders)
		const recentOrders = await prisma.cart.findMany({
			where: { userId: userId },
			include: {
				productVariant: {
					include: {
						Product: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 3,
		});
		
		// Format the data for the frontend
		const dashboardData = {
			user,
			stats: {
				totalOrders: cartItemsCount,
				wishlistItems: wishlistItemsCount,
				totalReviews: reviewsCount,
			},
			recentOrders: recentOrders.map(order => ({
				id: order.id,
				date: order.createdAt,
				status: "Processing", // In a real app, this would come from order status
				total: order.productVariant.Product.price.toNumber() * order.quantity,
				items: `${order.productVariant.Product.name} (x${order.quantity})`,
			})),
		};
		
		res.status(200).json(dashboardData);
	} catch (error) {
		console.error("Failed to fetch dashboard data", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
