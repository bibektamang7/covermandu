import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

async function middleware(req: NextRequest) {
	const session = await auth();
	const path = req.nextUrl.pathname;
	// const isPublicPath = path === "/signup" || path === "/login";

	const isPrivatePath =
		path.startsWith("/dashboard") || path.startsWith("/cart");

	const isAdminPath = path.startsWith("/admin");

	if ((!session && isPrivatePath) || (isAdminPath && !session)) {
		return NextResponse.redirect(new URL("/login", req.url));
	}
	if (isAdminPath && session && session.user?.role === "USER") {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/cart", "/admin", "/admin/:path", "/dashboard", "/"],
};

export default middleware;
