import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createProductSchema } from "@/validation/product.validation";
import { prisma } from "@/lib/db";
// POST create product
export async function POST(req: NextRequest) {
	const body = await req.json();
	try {
		const parsedData = createProductSchema.safeParse(body);
		if (!parsedData.success) {
			return NextResponse.json(
				{ success: false, message: "Validation failed" },
				{ status: 400 }
			);
		}

		const product = await prisma.product.create({
			data: {
				name: parsedData.data.name,
				description: parsedData.data.description,
				price: parsedData.data.price,
				discount: parsedData.data.discount || 0,
				variants: {
					createMany: {
						data: parsedData.data.variants,
					},
				},
			},
		});
		if (!product) {
			return NextResponse.json(
				{ success: false, message: "Failed to create product" },
				{ status: 400 }
			);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.log("Failed to create product", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
