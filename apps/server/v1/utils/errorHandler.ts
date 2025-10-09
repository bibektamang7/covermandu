import { Request, Response, NextFunction } from "express";
import { CustomError } from "./CustomError";
import * as Sentry from "@sentry/bun";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Sentry.captureException(err);
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json({
			success: err.success,
			message: err.message,
			errors: err.errors,
		});
	}

	if (err.name === "PrismaClientKnownRequestError") {
		let message = "Database error occurred";

		switch (err.code) {
			case "P2002":
				message = "A record with this value already exists";
				break;
			case "P2025":
				message = "Record not found";
				break;
			case "P2003":
				message = "Foreign key constraint violation";
				break;
			case "P2023":
				message = "Invalid value provided";
				break;
			default:
				message = `Database error: ${err.message}`;
		}

		return res.status(400).json({
			success: false,
			message: message,
			error_code: err.code,
		});
	}

	if (err.name === "ZodError") {
		return res.status(400).json({
			success: false,
			message: "Validation error",
			errors: err.errors.map((error: any) => error.message),
		});
	}

	console.error("Unhandled error:", err);
	return res.status(500).json({
		success: false,
		message:
			process.env.NODE_ENV === "production"
				? "Internal server error"
				: err.message || "Something went wrong",
	});
};

// Not Found Middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new CustomError(404, `Route ${req.originalUrl} not found`);
	next(error);
};
