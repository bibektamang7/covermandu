// GET /POST products
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

import { createProductSchema } from "@/validation/product.validation";

// GET all products
//TODO: pagination
// export async function GET() {
// 	const products = await prisma.product.findMany({
// 		include: { variants: true, reviews: true },
// 	});
// 	return NextResponse.json(products);
// }

