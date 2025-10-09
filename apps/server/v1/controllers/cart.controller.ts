import type { Request, Response } from "express";
import { prisma } from "db";
import { addToCartSchema } from "../validation/cart.validation";
import { CustomError } from "../utils/CustomError";

export const addToCart = async (req: Request, res: Response) => {
	const parsed = addToCartSchema.safeParse(req.body);
	if (!parsed.success) {
		throw new CustomError(400, "Validation error", "", [parsed.error.message]);
	}

	try {
		const { productVariantId, quantity } = parsed.data;
		const productVariant = await prisma.productVariant.findUnique({
			where: {
				id: productVariantId,
			},
		});
		if (!productVariant) {
			throw new CustomError(404, "Product not found");
		}
		if (productVariant.stock < quantity) {
			throw new CustomError(400, "Quantity exceeds available stock");
		}

		const cartItem = await prisma.cart.upsert({
			where: {
				userId_productVariantId: { userId: req.user.id, productVariantId },
			},
			update: {
				quantity: {
					increment: 1,
				},
			},
			create: {
				userId: req.user.id,
				productVariantId: productVariant.id,
				quantity: quantity,
			},
		});
		if (!cartItem) {
			throw new CustomError(400, "Failed to create cart");
		}

		return res.status(200).json(cartItem);
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
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
		throw new CustomError(400, "Cart ID and quantity are required");
	}
	if (quantity !== -1 && quantity !== 1) {
		throw new CustomError(400, "Invalid quantity");
	}

	try {
		const cart = await prisma.cart.findUnique({
			where: { id: cartId, userId: req.user.id },
			include: { productVariant: true },
		});
		console.log("this is cart");
		if (!cart) {
			throw new CustomError(404, "Cart item not found");
		}
		if (cart.productVariant.stock < quantity) {
			throw new CustomError(400, "Quantity exceeds available stock");
		}

		const updatedCart = await prisma.cart.update({
			where: { id: cartId },
			data: {
				quantity: {
					increment: quantity,
				},
			},
		});
		if (!updatedCart) {
			throw new CustomError(400, "Failed to update cart");
		}
		res.status(200).json(updatedCart);
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};

export const deleteCartItem = async (req: Request, res: Response) => {
	const { cartId } = req.params;

	if (!cartId) {
		throw new CustomError(400, "Cart ID is required");
	}

	try {
		const cart = await prisma.cart.findUnique({
			where: {
				id: cartId,
			},
		});
		if (!cart) {
			throw new CustomError(404, "Cart not found");
		}
		if (cart.userId.toString() !== req.user.id.toString()) {
			throw new CustomError(401, "Unauthorized to delete cart");
		}
		const deletedCart = await prisma.cart.delete({
			where: { id: cart.id },
		});
		if (!deletedCart) {
			throw new CustomError(400, "Failed to delete cart item");
		}
		res.status(200).json({ message: "Cart item deleted" });
	} catch (error) {
		// The error will be handled by the global error handler
		throw error;
	}
};
