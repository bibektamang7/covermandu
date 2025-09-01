import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { registerSchema } from "@/validation/auth.validation";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
	const body = await req.json();
	try {
		const parsedData = registerSchema.safeParse(body);
		if (!parsedData.success) {
			return NextResponse.json(
				{ success: false, message: "Validation failed" },
				{ status: 400 }
			);
		}
		const userExists = await prisma.user.findUnique({
			where: {
				email: parsedData.data.email,
			},
		});
		if (userExists) {
			return NextResponse.json(
				{ success: false, message: "User already exists." },
				{ status: 400 }
			);
		}
		const createdUser = await prisma.user.create({
			data: {
				email: parsedData.data.email,
				image: parsedData.data.image,
				name: parsedData.data.name,
			},
		});
		if (!createdUser) {
			return NextResponse.json(
				{ success: false, message: "Failed to create user" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ success: true, message: "User registered successfuly." },
			{ status: 200 }
		);
	} catch (error) {
		console.log("failed to register user", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
