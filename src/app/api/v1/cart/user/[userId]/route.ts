import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// GET cart by user
export async function GET(
	_: NextRequest,
	{ params }: { params: { userId: string } }
) {
	if (!params.userId) {
		return NextResponse.json(
			{ success: false, message: "User Id required" },
			{ status: 400 }
		);
	}
	try {
		const cart = await prisma.cart.findMany({
			where: { userId: params.userId },
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
	} catch (error) {
		console.log("Failed to get carts", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
