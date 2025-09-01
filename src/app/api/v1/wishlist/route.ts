import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyMiddleware } from "@/lib/verifyUser";

// POST add to wishlist
export async function POST(req: NextRequest) {
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

//GET Wishlist by user

export async function GET(req: NextRequest) {
	try {
		const user = await verifyMiddleware(req);
		//TODO: only includes necessary files
		const wishlists = await prisma.wishlist.findMany({
			where: {
				userId: user.id,
			},
			include: { product: true },
		});
		return NextResponse.json(
			{ success: true, data: wishlists },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
