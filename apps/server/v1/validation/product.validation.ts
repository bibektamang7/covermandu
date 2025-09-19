import * as z from "zod";

const availableModels = [""];

export const createProductSchema = z.object({
	name: z.string(),
	description: z.string(),
	price: z.uint32(),
	discount: z.uint32().optional(),
	availableModel: z.enum(["IPHONE_7_TO_IPHONE_15"]),
	category: z.enum([
		"SLIM_CASE",
		"CLEAR_CASE",
		"RUGGED_CASE",
		"SILICONE_CASE",
		"LEATHER_CASE",
		"WOODEN_CASE",
		"WALLET_CASE",
		"STAND_CASE",
		"MAGSAFE_COMPATIBLE",
		"FLIP_CASE",
	]),
	variants: z
		.array(
			z.object({
				color: z.string(),
				stock: z.uint32(),
				image: z.string(),
				phoneModel: z.enum([
					"IPHONE_15",
					"IPHONE_15_PRO",
					"IPHONE_15_PRO_MAX",
					"IPHONE_14",
					"IPHONE_14_PRO",
					"IPHONE_14_PRO_MAX",
				]),
			})
		)
		.min(1),
	tag: z.enum(["TRENDING", "NEW", "MOST_LIKED", "POPULAR", "PREMIUM"]),
});

export const updateProductSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	price: z.uint32().optional(),
	discount: z.uint32().optional(),
});
