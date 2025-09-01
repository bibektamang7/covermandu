import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// PUT update product
//TODO: NOT SURE RIGHT NOT
// export async function PUT(
// 	req: NextRequest,
// 	{ params }: { params: { id: string } }
// ) {
// 	const body = await req.json();
// 	const product = await prisma.product.update({
// 		where: { id: params.id },
// 		data: body,
// 		include: { variants: true },
// 	});
// 	return NextResponse.json(product);
// }

// DELETE product
export async function DELETE(
	_: NextRequest,
	{ params }: { params: { id: string } }
) {
	if (!params.id) {
		return NextResponse.json(
			{ success: false, message: "Product Id required" },
			{ status: 400 }
		);
	}
	try {
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
