import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyMiddleware } from "@/lib/verifyUser";

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

// PUT update product
//TODO: NOT SURE RIGHT NOT
export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const user = await verifyMiddleware(req);
		if (user.role !== "ADMIN") {
			return NextResponse.json(
				{ success: false, message: "Unauthorize access" },
				{ status: 401 }
			);
		}
		const body = await req.json();
		const product = await prisma.product.update({
			where: { id: params.id },
			data: body,
			include: { variants: true },
		});
		return NextResponse.json(product);
	} catch (error: any) {
		console.error("Faled to update product", error);
		if (error.code === "P2003") {
			return NextResponse.json(
				{ success: false, message: "Product not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// DELETE product
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	if (!params.id) {
		return NextResponse.json(
			{ success: false, message: "Product Id required" },
			{ status: 400 }
		);
	}
	try {
		const user = await verifyMiddleware(req);
		if (user.role !== "ADMIN") {
			return NextResponse.json(
				{ success: false, message: "Unauthorize access" },
				{ status: 401 }
			);
		}
		const product = await prisma.product.delete({ where: { id: params.id } });
		if (!product) {
			return NextResponse.json(
				{ success: false, message: "Failed to delete product" },
				{ status: 400 }
			);
		}
		return NextResponse.json({ message: "Product deleted" });
	} catch (error) {
		console.log("Failed to delete product", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
