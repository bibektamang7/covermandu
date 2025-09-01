// GET / POST products

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { createReviewSchema } from "@/validation/review.validation";

// POST review
export async function POST(req: NextRequest) {
	const body = await req.json();
	try {
		const parsedData = createReviewSchema.safeParse(body);
		if (!parsedData.success) {
			return NextResponse.json(
				{ success: false, message: "Validation failed" },
				{ status: 400 }
			);
		}

		const product = await prisma.product.findUnique({
			where: {
				id: parsedData.data.productId,
			},
		});
		if (!product) {
			return NextResponse.json(
				{ success: false, message: "Product not found" },
				{ status: 404 }
			);
		}

		const reviewer = await prisma.user.findUnique({
			where: {
				id: parsedData.data.reviewerId,
			},
		});
		if (!reviewer) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		const review = await prisma.review.create({
			data: {
				message: parsedData.data.message,
				stars: parsedData.data.stars,
				reviewerId: reviewer.id,
				productId: product.id,
			},
		});
		if (!review) {
			return NextResponse.json(
				{ success: false, message: "Failed to create review" },
				{ status: 400 }
			);
		}
		return NextResponse.json(review, { status: 200 });
	} catch (error) {
		console.log("failed to post review", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
