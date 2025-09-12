import type { Request, Response } from "express";
import { prisma } from "../db/index";

export const getWishlistItems = async (req: Request, res: Response) => {
	try {
		const wishlist = await prisma.wishlist.findMany({
			where: { userId: req.user.id },
		});
		res.status(200).json(wishlist);
	} catch (error) {
		console.error("Failed to get wishlist items", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const addToWishList = async (req: Request, res: Response) => {
	try {
		const { productVariantId } = req.body;
		if (!productVariantId) {
			res.status(400).json({ message: "Product ID is required" });
			return;
		}
		const wishlist = await prisma.wishlist.upsert({
			where: {
				userId_productVariantId: { userId: req.user.id, productVariantId },
			},
			update: {},
			create: { userId: req.user.id, productVariantId },
		});
		if (!wishlist) {
			res.status(400).json({ message: "Failed to update wishlist" });
			return;
		}

		res.status(200).json({ message: "Product added to wishlist" });
	} catch (error) {
		console.error("Failed to add to wishlist", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getWishlist = async (req: Request, res: Response) => {
	try {
		const wishlists = await prisma.wishlist.findMany({
			where: { userId: req.user.id },
			include: { productVariant: true },
		});

		res.status(200).json(wishlists);
	} catch (error) {
		console.log("Failed to get wishlist", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteWishlistItem = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id) {
		res.status(400).json({ message: "Wishlist item ID is required" });
		return;
	}
	try {
		await prisma.wishlist.delete({
			where: { id: id, userId: req.user.id },
		});
		res.status(200).json({ message: "Wishlist item removed" });
	} catch (error) {
		console.error("Failed to remove wishlist item", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
