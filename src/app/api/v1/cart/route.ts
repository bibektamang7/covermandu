import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { createCartSchema } from "@/validation/cart.validation";
import { verifyMiddleware } from "@/lib/verifyUser";

// POST add to cart
//TODO: add rate limit

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsedData = createCartSchema.safeParse(body);
		if (!parsedData.success) {
			return NextResponse.json(
				{ success: false, message: "Validation Error" },
				{ status: 400 }
			);
		}
		const { productVariantId, quantity, userId } = parsedData.data;

		const productVariant = await prisma.productVariant.findUnique({
			where: {
				id: productVariantId,
			},
		});
		if (!productVariant) {
			return NextResponse.json(
				{ success: false, message: "Product not found" },
				{ status: 404 }
			);
		}
		if (productVariant.stock < quantity) {
			return NextResponse.json(
				{ success: false, message: "Quantity exceeds available stock" },
				{ status: 400 }
			);
		}

		const cartItem = await prisma.cart.upsert({
			where: { userId_productVariantId: { userId, productVariantId } },
			update: { quantity: quantity },
			create: {
				userId: parsedData.data.userId,
				productVariantId: productVariant.id,
				quantity: parsedData.data.quantity,
			},
		});
		if (!cartItem) {
			return NextResponse.json(
				{ success: false, message: "Failed to create cart" },
				{ status: 400 }
			);
		}

		return NextResponse.json(cartItem, { status: 200 });
	} catch (error) {
		console.log("Failed to add to cart", error);
		return NextResponse.json(
			{ success: false, message: "Interval Server Error" },
			{ status: 500 }
		);
	}
}

// GET CART OF USER

export async function GET(req: NextRequest) {
	try {
		const user = await verifyMiddleware(req);
		const cart = await prisma.cart.findMany({
			where: { userId: user.id },
			include: {
				productVariant: {
					include: {
						Product: true,
					},
				},
			},
		});
		if (!cart) {
			return NextResponse.json(
				{ success: false, message: "Failed to get carts" },
				{ status: 400 }
			);
		}
		return NextResponse.json(cart, { status: 200 });
	} catch (error: any) {
		console.log("Failed to get carts", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
