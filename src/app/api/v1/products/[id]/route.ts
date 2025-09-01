import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// GET product by ID
export async function GET(
	_: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id: productId } = params;
	if (!productId) {
		return NextResponse.json(
			{ success: false, message: "Product Id required" },
			{ status: 400 }
		);
	}
	try {
		const product = await prisma.product.findUnique({
			where: { id: productId },
			include: {
				variants: true,
				reviews: {
					take: 5,
				},
			},
		});
		if (!product) {
			return NextResponse.json(
				{ success: false, message: "Product not found." },
				{ status: 404 }
			);
		}
		return NextResponse.json({ product }, { status: 200 });
	} catch (error) {
		console.log("Failed to get product", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
