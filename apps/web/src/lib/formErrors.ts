import { ZodError, core } from "zod";

export interface FormErrors {
	[key: string]: string;
}

export const formatZodErrors = (error: ZodError): FormErrors => {
	const errors: FormErrors = {};

	error.issues.forEach((issue: core.$ZodIssue) => {
		const path = issue.path.join(".");
		errors[path] = issue.message;
	});

	return errors;
};

export const getNestedError = (
	errors: FormErrors,
	path: string
): string | undefined => {
	return errors[path];
};
