import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

async function middleware(req: NextRequest) {
	const session = await auth();
	const path = req.nextUrl.pathname;
	console.log("this ispath ", path);

	const isPublicPath = path === "/signup" || path === "/login";

	if (isPublicPath && session) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}
	const isPrivatePath =
		path.startsWith("/dashboard") || path.startsWith("/cart");

	if (!isPublicPath && !session && isPrivatePath) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/cart", "/login", "/dashboard", "/"],
};

export default middleware;
