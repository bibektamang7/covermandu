import type { NextRequest } from "next/server";
import { decodeToken } from "./jwt";
import { prisma } from "./db";
import type { User } from "@prisma/client";

//TODO: handle thrown errors response to the routes
export async function verifyMiddleware(req: NextRequest): Promise<User> {
	const token = req.headers.get("Authorization")?.split(" ")[1];
	if (!token) {
		throw new Error("Token required");
	}
	const decodedToken = decodeToken(token);
	const user = await prisma.user.findUnique({
		where: { id: decodedToken.id },
	});
	if (!user) {
		throw new Error("Unauthorized");
	}
	return user;
}
