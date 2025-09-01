// GET reviews by user
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

//TODO: NOT SURE ABOUT THE ROUTE< NEED TO CONSIDER
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
		const reviews = await prisma.review.findMany({
			where: { reviewerId: params.userId },
			include: { product: true },
		});
		return NextResponse.json(reviews);
	} catch (error) {
		console.log("failed ot get review by user", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
