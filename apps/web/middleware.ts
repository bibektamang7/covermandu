import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

async function middleware(req: NextRequest) {
	const session = await auth();
	const path = req.nextUrl.pathname;

	const isPublicPath = path === "/" || path === "/login";

	if (isPublicPath && session) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	if (!isPublicPath && !session) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/login", "/dashboard", "/"],
};

export default middleware;
