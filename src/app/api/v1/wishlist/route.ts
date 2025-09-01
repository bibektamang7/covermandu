// POST add to wishlist

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST add to wishlist
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { userId, productId } = body;

		if (!userId || !productId) {
			return NextResponse.json(
				{ success: false, message: "Invalid request" },
				{ status: 400 }
			);
		}
		const wishlist = await prisma.wishlist.upsert({
			where: { userId_productId: { userId, productId } },
			update: {},
			create: { userId, productId },
		});

		if (!wishlist) {
			return NextResponse.json(
				{ success: false, message: "Failed to update wishlist" },
				{ status: 400 }
			);
		}
		return NextResponse.json({ message: "Added Wishlist" }, { status: 200 });
	} catch (error: any) {
		console.log("Failed to add to cart", error);
		if (error.code === "P2003") {
			return NextResponse.json(
				{ success: false, message: "User or Product does exists." },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ success: false, message: "Interval Server Error" },
			{ status: 500 }
		);
	}
}
