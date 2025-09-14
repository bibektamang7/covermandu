import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "db";

export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "Authentication required" });
		return;
	}
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
		const user = await prisma.user.findUnique({
			where: { id: (decoded as any).id },
		});
		if (!user) {
			return res.status(401).json({ message: "Invalid token" });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

export const authenticateAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	authenticateUser(req, res, async () => {
		if (req.user?.role !== "ADMIN") {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	});
};
