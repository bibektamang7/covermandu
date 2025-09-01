import * as z from "zod";

export const createCartSchema = z.object({
	userId: z.string(),
	productVariantId: z.string(),
	quantity: z.uint32(),
});
