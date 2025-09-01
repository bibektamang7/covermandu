import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// PUT / DELETE cart item

// PUT update cart item
//TODO: Rate limit
export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const body = await req.json();
	if (!params.id) {
		return NextResponse.json(
			{ success: false, message: "Card id required" },
			{ status: 400 }
		);
	}

	try {
		const cartItem = await prisma.cart.findUnique({
			where: { id: params.id },
			include: { productVariant: true },
		});
		if (!cartItem) {
			return NextResponse.json(
				{ success: false, message: "Cart not found" },
				{ status: 404 }
			);
		}

		if (body.quantity > cartItem.productVariant.stock) {
			return NextResponse.json(
				{ success: false, message: "Quantity exceeds available stock" },
				{ status: 400 }
			);
		}
		const updatedCart = await prisma.cart.update({
			where: { id: cartItem.id },
			data: { quantity: body.quantity },
		});
		if (!updatedCart) {
			return NextResponse.json(
				{ success: false, message: "Failed to update cart" },
				{ status: 400 }
			);
		}
		return NextResponse.json(updatedCart, { status: 200 });
	} catch (error: any) {
		console.log("Failed to update cart", error);
		if (error.code === "P2003") {
			return NextResponse.json(
				{ success: false, message: "Card not found" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// DELETE cart item
//TODO: rate limit

export async function DELETE(
	_: NextRequest,
	{ params }: { params: { id: string } }
) {
	if (!params.id) {
		return NextResponse.json(
			{ success: false, message: "Cart Item required" },
			{ status: 400 }
		);
	}
	try {
		await prisma.cart.delete({ where: { id: params.id } });
		return NextResponse.json({ message: "Cart item deleted" });
	} catch (error) {
		console.log("Failed to delete cart", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
