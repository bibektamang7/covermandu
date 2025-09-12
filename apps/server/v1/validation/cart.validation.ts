import * as z from "zod"

export const addToCartSchema = z.object({
	productVariantId: z.string().min(1, "Product variant ID is required"),
	quantity: z.uint32().min(1, "Quantity must be at least 1")
})