import type { Request, Response } from "express";
import { prisma } from "db";
import {
	loginUserSchema,
	registerUserSchema,
} from "../validation/user.validation";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { CustomError } from "../utils/CustomError";
import * as Sentry from "@sentry/bun";
import { captureError, withSentryTracing } from "../utils/sentryHelpers";

export const loginUser = async (req: Request, res: Response) => {
	const parsed = loginUserSchema.safeParse(req.body);
	if (!parsed.success) {
		throw new CustomError(400, "Validation error", "", [parsed.error.message]);
	}
	const { email, googleId } = parsed.data;
	try {
		const user = await prisma.user.findUnique({
			where: { email, googleId },
		});
		if (!user) {
			throw new CustomError(404, "User not found");
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
		// The error will be handled by the global error handler
		throw error;
	}
};

export const registerUser = async (req: Request, res: Response) => {
	const transaction = Sentry.startTransaction({
		op: 'http.server',
		name: 'User Registration',
	});
	
	Sentry.getCurrentScope().setSpan(transaction);
	
	try {
		console.log("is it here or not in register");
		const parsed = registerUserSchema.safeParse(req.body);
		if (!parsed.success) {
			throw new CustomError(400, "Validation error", "", [parsed.error.message]);
		}
		const { name, image, googleId, email } = parsed.data;
		
		// Trace the database operations
		const existingUser = await withSentryTracing('Check existing user', async () => {
			return await prisma.user.findUnique({
				where: { email, googleId },
			});
		});
		
		if (existingUser) {
			throw new CustomError(400, "User already exists");
		}
		
		const user = await withSentryTracing('Create user', async () => {
			return await prisma.user.create({
				data: {
					name,
					email,
					image,
					googleId,
					role: process.env.ADMIN_EMAIL?.includes(email) ? "ADMIN" : "USER",
				},
			});
		});

		if (!user) {
			throw new CustomError(400, "Failed to create user");
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
		transaction.setStatus('ok');
	} catch (error) {
		transaction.setStatus('internal_error');
		captureError(error as Error, req, { 
			operation: 'user_registration',
			email: req.body?.email 
		});
		// The error will be handled by the global error handler
		throw error;
	} finally {
		transaction.finish();
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
		throw new CustomError(500, "Failed to generate upload signature");
	}
};

export const getUser = (req: Request, res: Response) => {
	res.status(200).json({ user: req.user });
};

export const getAllUsers = async (req: Request, res: Response) => {
	const transaction = Sentry.startTransaction({
		op: 'http.server',
		name: 'Get All Users',
	});
	
	Sentry.getCurrentScope().setSpan(transaction);
	
	try {
		const users = await withSentryTracing('Fetch all users', async () => {
			return await prisma.user.findMany({
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
		});

		res.status(200).json({ users });
		transaction.setStatus('ok');
	} catch (error) {
		transaction.setStatus('internal_error');
		captureError(error as Error, req, { operation: 'get_all_users' });
		// The error will be handled by the global error handler
		throw error;
	} finally {
		transaction.finish();
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
			throw new CustomError(404, "User not found");
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
			recentOrders: recentOrders.map((order) => ({
				id: order.id,
				date: order.createdAt,
				status: "Processing", // In a real app, this would come from order status
				total: order.productVariant.Product.price.toNumber() * order.quantity,
				items: `${order.productVariant.Product.name} (x${order.quantity})`,
			})),
		};

		res.status(200).json(dashboardData);
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};
