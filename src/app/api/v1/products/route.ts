import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

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
