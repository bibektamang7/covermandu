import { verifyMiddleware } from "@/lib/verifyUser";
import { NextResponse, type NextRequest } from "next/server";
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET(req: NextRequest) {
	try {
		const user = await verifyMiddleware(req);
		if (user.role !== "ADMIN") {
			return NextResponse.json(
				{ success: false, message: "Unauthorized access" },
				{ status: 401 }
			);
		}
		const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
		const { token, expire, signature } = getUploadAuthParams({
			privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
			publicKey: publicKey!,
			expire: 10 * 60,
		});
		return NextResponse.json({ token, expire, signature, publicKey });
	} catch (error) {
		console.error("Failed to authenticate upload", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
