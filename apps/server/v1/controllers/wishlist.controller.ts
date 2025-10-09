import type { Request, Response } from "express";
import { prisma } from "db";
import { CustomError } from "../utils/CustomError";

export const getWishlistItems = async (req: Request, res: Response) => {
	try {
		const wishlist = await prisma.wishlist.findMany({
			where: { userId: req.user.id },
		});
		res.status(200).json(wishlist);
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const addToWishList = async (req: Request, res: Response) => {
	const { productId } = req.body;
	if (!productId) {
		throw new CustomError(400, "Product ID is required");
	}
	try {
		const wishlist = await prisma.wishlist.upsert({
			where: {
				userId_productId: { userId: req.user.id, productId },
			},
			update: {},
			create: { userId: req.user.id, productId },
		});
		if (!wishlist) {
			throw new CustomError(400, "Failed to update wishlist");
		}

		res.status(200).json({ message: "Product added to wishlist", wishlist });
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const getWishlist = async (req: Request, res: Response) => {
	try {
		const wishlists = await prisma.wishlist.findMany({
			where: { userId: req.user.id },
			include: { product: true },
		});

		res.status(200).json(wishlists);
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const deleteWishlistItem = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id) {
		throw new CustomError(400, "Wishlist item ID is required");
	}
	try {
		await prisma.wishlist.delete({
			where: { id: id, userId: req.user.id },
		});
		res.status(200).json({ message: "Wishlist item removed" });
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};
