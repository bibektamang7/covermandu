import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyMiddleware } from "@/lib/verifyUser";
import { createProductSchema } from "@/validation/product.validation";

// GET all products
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const page = Number(searchParams.get("page") || 1);
		const limit = Number(searchParams.get("limit") || 10);
		const skip = (page - 1) * limit;

		const search = searchParams.get("search") || "";

		const sortBy = (searchParams.get("sortBy") ||
			"createdAt") as keyof typeof prisma.product;

		const order = (searchParams.get("order") || "desc") as "asc" | "desc";

		const products = await prisma.product.findMany({
			where: {
				name: {
					contains: search,
					mode: "insensitive",
				},
			},
			include: {
				variants: true,
				reviews: true,
			},
			skip,
			take: limit,
			orderBy: { [sortBy]: order },
		});

		const total = await prisma.product.count({
			where: { name: { contains: search, mode: "insensitive" } },
		});
		return NextResponse.json(
			{ success: true, page, limit, products, total },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to fetch products", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

const generateSKU = (): string => {
	const prefix = Math.floor(Math.random() * 1e9); //9 digit random
	const suffix = Math.floor(Math.random() * 1e9);
	return `${prefix}_NP-${suffix}`;
};

export async function POST(req: NextRequest) {
	try {
		const user = await verifyMiddleware(req);
		if (user.role !== "ADMIN") {
			return NextResponse.json(
				{ success: false, message: "Unauthorize access" },
				{ status: 401 }
			);
		}
		const body = await req.json();
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
						data: parsedData.data.variants.map((variant) => {
							return {
								color: variant.color,
								image: variant.image,
								stock: variant.stock,
								sku: generateSKU(),
							};
						}),
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
