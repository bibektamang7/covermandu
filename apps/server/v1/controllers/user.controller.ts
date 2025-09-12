import type { Request, Response } from "express";
import { prisma } from "../db/index";
import {
	loginUserSchema,
	registerUserSchema,
} from "../validation/user.validation";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
	try {
		const parsed = loginUserSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({ message: "Validation error" });
			return;
		}
		const { email, googleId } = parsed.data;
		const user = await prisma.user.findUnique({
			where: { email, googleId },
		});
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}
		const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET!, {
			expiresIn: "7d",
		});
		res.status(200).json({ user, token });
	} catch (error) {
		console.error("Failed to login user", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const registerUser = async (req: Request, res: Response) => {
	try {
		const parsed = registerUserSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({ message: "Validation error" });
			return;
		}
		const { name, image, googleId, email } = parsed.data;
		const existingUser = await prisma.user.findUnique({
			where: { email, googleId },
		});
		if (existingUser) {
			res.status(400).json({ message: "User already exists" });
			return;
		}
		const user = await prisma.user.create({
			data: {
				name,
				email,
				image,
				googleId,
				role: process.env.ADMIN_EMAIL?.includes(email) ? "ADMIN" : "USER",
			},
		});
		if (!user) {
			res.status(400).json({ message: "Failed to create user" });
			return;
		}
		const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET!, {
			expiresIn: "7d",
		});
		res.status(200).json({ user, token });
	} catch (error) {
		console.error("Failed to register user", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getSignedUrl = async (req: Request, res: Response) => {};

export const getUser = (req: Request, res: Response) => {
	res.status(200).json({ user: req.user });
};
