import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	interface Session extends DefaultUser {
		accessToken?: string;
	}
	interface User {
		token: string
		role: string
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
	}
}