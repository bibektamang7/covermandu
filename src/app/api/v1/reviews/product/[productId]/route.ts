// GET reviews by product

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

//TODO: pagination
export async function GET(
	_: NextRequest,
	{ params }: { params: { productId: string } }
) {
	if (!params.productId) {
		return NextResponse.json(
			{ success: false, message: "Product Id required" },
			{ status: 400 }
		);
	}
	try {
		const reviews = await prisma.review.findMany({
			where: { productId: params.productId },
			include: { reviewer: true },
		});
		return NextResponse.json(reviews);
	} catch (error) {
		console.log("Failed to get ")
	}
}
