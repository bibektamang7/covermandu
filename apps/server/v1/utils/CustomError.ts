export class CustomError extends Error {
	message: string;
	statusCode: number;
	success: boolean;
	errors: string[];
	constructor(
		statusCode: number,
		message: string,
		stack: string = "",
		errors: string[] = []
	) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.errors = errors;
		this.success = false;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
