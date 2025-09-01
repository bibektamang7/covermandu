import * as z from "zod";

export const createProductSchema = z.object({
	name: z.string(),
	description: z.string(),
	price: z.uint32(),
	discount: z.uint32().optional(),
	variants: z
		.array(
			z.object({
				color: z.string(),
				stock: z.uint32(),
				image: z.string(),
			})
		)
		.min(1),
});
