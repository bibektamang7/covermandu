import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { loginSchema } from "@/validation/auth.validation";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
	const body = await req.json();
	try {
		const parsedData = loginSchema.safeParse(body);
		if (!parsedData.success) {
			return NextResponse.json(
				{ success: false, message: "Validation failed" },
				{ status: 400 }
			);
		}
		const createdUser = await prisma.user.findUnique({
			where: {
				email: parsedData.data.email,
			},
			include: {
				_count: {
					select: {
						cartItems: true,
					},
				},
			},
		});
		if (!createdUser) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.log("Failed to login", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
