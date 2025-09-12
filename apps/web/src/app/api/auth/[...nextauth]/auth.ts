import NextAuth from "next-auth";
import axios from "axios";
import Google from "next-auth/providers/google";

import type { NextAuthConfig, NextAuthResult } from "next-auth";
import { CircuitBreaker, retryApiCall } from "@/lib/utils";

const apiClient = axios.create({
	timeout: 10000,
});

const circuitBreaker = new CircuitBreaker();

const backendURL = process.env.BACKEND_BASE_URL;

if (!backendURL) {
	console.error("BACKEND_BASE_URL environment variable is not set");
}

const config = {
	trustHost: true,
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
} as NextAuthConfig;

const result = NextAuth({
	...config,
	session: {
		strategy: "jwt",
		maxAge: 84600 * 7,
	},
	callbacks: {
		async signIn({ account, profile, user }) {
			if (account?.provider === "google") {
				if (!profile?.email) {
					console.warn("Google profile missing email");
					return false;
				}

				try {
					console.log(`Attempting to login user: ${profile.email}`);

					const loginResponse = await retryApiCall(() =>
						circuitBreaker.call(() =>
							apiClient.post(`${backendURL}/users/login`, {
								googleId: profile.sub?.toString(),
								email: profile.email,
							})
						)
					);

					console.log(`Login successful for user: ${profile.email}`);
					user.id = loginResponse.data.user.id;
					user.token = loginResponse.data.token;
				} catch (error: any) {
					console.error(
						`Login failed for user: ${profile.email}`,
						error.message || error
					);

					// If it's a client error (user not found, validation error), try to register
					if (
						error.response &&
						(error.response.status === 404 || error.response.status === 400)
					) {
						try {
							console.log(`Attempting to register user: ${profile.email}`);

							const signUpResponse = await retryApiCall(() =>
								circuitBreaker.call(() =>
									apiClient.post(`${backendURL}/users/register`, {
										googleId: profile.sub?.toString(),
										email: profile.email,
										image: profile.picture,
										name: profile.name ?? `${profile.email?.split("@")[0]}`,
									})
								)
							);

							console.log(`Registration successful for user: ${profile.email}`);
							user.id = signUpResponse.data.user.id;
							user.token = signUpResponse.data.token;
						} catch (registerError: any) {
							console.error(
								`Registration failed for user: ${profile.email}`,
								registerError.message || registerError
							);
							// If registration fails, we'll deny the sign-in
							return false;
						}
					} else {
						// For server errors or network issues, we'll deny the sign-in
						return false;
					}
				}
			}
			return true;
		},
		async jwt({ token, user, account, profile }) {
			if (account && profile) {
				token.id = user.id;
				token.image = profile.picture;
				token.name = profile.name ?? `${profile.email?.split("@")[0]}`;
				token.accessToken = user.token;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.accessToken = token.accessToken as string;
				session.user.id = token.id as string;
				session.user.image = token.image as string;
				session.user.name = token.name as string;
			}
			return session;
		},
	},
	events: {
		signIn: async ({ user, account, profile, isNewUser }) => {
			console.log(`User signed in: ${user.id} (${account?.provider})`);
		},
		signOut: async ({}) => {
			console.log(`User signed out: `);
		},
	},
});

const handlers: NextAuthResult["handlers"] = result.handlers;
const auth: NextAuthResult["auth"] = result.auth;
const signIn: NextAuthResult["signIn"] = result.signIn;
const signOut: NextAuthResult["signOut"] = result.signOut;

export { handlers, auth, signIn, signOut };
