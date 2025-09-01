// GET reviews by product
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
	req: NextRequest,
	{ params }: { params: { productId: string } }
) {
	if (!params.productId) {
		return NextResponse.json(
			{ success: false, message: "Product Id required" },
			{ status: 400 }
		);
	}
	try {
		const { searchParams } = new URL(req.url);
		const page = Number(searchParams.get("page")) | 1;
		const limit = Number(searchParams.get("limit")) | 5;
		const skip = (page - 1) * limit;

		const reviews = await prisma.review.findMany({
			where: { productId: params.productId },
			include: { reviewer: true },
			skip,
			take: limit,
		});
		return NextResponse.json(reviews);
	} catch (error) {
		console.log("Failed to get ", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
