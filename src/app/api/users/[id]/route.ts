//GET / PUT / DELETE user by id

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id: userId } = params;
	if (!userId) {
		return NextResponse.json(
			{ success: false, message: "user id required" },
			{ status: 400 }
		);
	}
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				_count: true,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "User not found!" },
				{ status: 400 }
			);
		}
		return NextResponse.json({ success: false, user }, { status: 200 });
	} catch (error) {
		console.log("failed to get user", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}

// export async function PUT(
// 	req: NextRequest,
// 	{ params }: { params: { id: string } }
// ) {
// 	const { id: userId } = params;
// }

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id: userId } = params;
	if (!userId) {
		return NextResponse.json(
			{ success: false, message: "user id required" },
			{ status: 400 }
		);
	}
	try {
		const user = await prisma.user.delete({
			where: { id: userId },
		});
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "Failed to delete user" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ success: true, message: "User deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.log("failed to delete user", error);
		return NextResponse.json(
			{ success: false, message: "Interval server error" },
			{ status: 500 }
		);
	}
}
