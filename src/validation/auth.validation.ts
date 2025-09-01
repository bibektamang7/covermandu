import * as z from "zod";

export const registerSchema = z.object({
	email: z.email(),
	name: z.string(),
	image: z.string(),
});

export const loginSchema = z.object({
	email: z.email(),
});
