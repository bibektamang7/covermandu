import type { Request, Response } from "express";
import { prisma } from "../db/index";
import { addToCartSchema } from "../validation/cart.validation";

export const addToCart = async (req: Request, res: Response) => {
	const parsed = addToCartSchema.safeParse(req.body);
	if (!parsed.success) {
		res.status(400).json({ message: "Validation error" });
		return;
	}

	try {
		const { productVariantId, quantity } = parsed.data;
		const productVariant = await prisma.productVariant.findUnique({
			where: {
				id: productVariantId,
			},
		});
		if (!productVariant) {
			return res.status(404).json({ message: "Product not found" });
		}
		if (productVariant.stock < quantity) {
			return res
				.status(400)
				.json({ message: "Quantity exceeds available stock" });
		}

		const cartItem = await prisma.cart.upsert({
			where: {
				userId_productVariantId: { userId: req.user.id, productVariantId },
			},
			update: { quantity: quantity },
			create: {
				userId: req.user.id,
				productVariantId: productVariant.id,
				quantity: quantity,
			},
		});
		if (!cartItem) {
			return res.status(400).json({ message: "Failed to create cart" });
		}

		return res.status(200).json(cartItem);
	} catch (error) {
		console.error("Failed to add to card", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const getCartItems = async (req: Request, res: Response) => {
	try {
		const cart = await prisma.cart.findMany({
			where: { userId: req.user.id },
			include: { productVariant: { include: { Product: true } } },
		});
		return res.status(200).json(cart);
	} catch (error) {
		console.error("Failed to get cart items", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateCartItem = async (req: Request, res: Response) => {
	const { cartId } = req.params;
	const { quantity } = req.body;
	if (!cartId || !quantity) {
		res.status(400).json({ message: "Cart ID and quantity are required" });
		return;
	}

	try {
		const cart = await prisma.cart.findUnique({
			where: { id: cartId, userId: req.user.id },
			include: { productVariant: true },
		});
		if (!cart) {
			res.status(404).json({ message: "Cart item not found" });
			return;
		}
		if (cart.productVariant.stock < quantity) {
			res.status(400).json({ message: "Quantity exceeds available stock" });
			return;
		}

		const updatedCart = await prisma.cart.update({
			where: { id: cartId },
			data: {
				quantity: quantity,
			},
		});
		if (!updatedCart) {
			res.status(400).json({ message: "Failed to update cart" });
			return;
		}
		res.status(200).json(updatedCart);
	} catch (error) {
		console.error("Failed to update cart", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteCartItem = async (req: Request, res: Response) => {
	const { cartId } = req.params;

	if (!cartId) {
		res.status(400).json({ message: "Cart ID is required" });
		return;
	}

	try {
		const deletedCart = await prisma.cart.deleteMany({
			where: { id: cartId, userId: req.user.id },
		});
		if (deletedCart.count === 0) {
			res.status(400).json({ message: "Failed to delete cart item" });
			return;
		}
		res.status(200).json({ message: "Cart item deleted" });
	} catch (error) {
		console.error("Failed to delete cart item", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

