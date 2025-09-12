import * as z from "zod";

export const registerUserSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email address"),
	googleId: z.string(),
	image: z.string(),
});

export const loginUserSchema = z.object({
	email: z.email("Invalid email address"),
	googleId: z.string(),
});
