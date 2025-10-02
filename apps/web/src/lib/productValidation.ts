import { z } from "zod";

export const productVariantSchema = z.object({
	color: z.string().min(1, "Color is required"),
	stock: z.number().min(0, "Stock must be a positive number"),
	image: z.instanceof(File).nullable(),
	phoneModel: z.string().min(1, "Phone model is required"),
});

export const productFormSchema = z.object({
	name: z
		.string()
		.min(1, "Product name is required")
		.max(100, "Product name must be less than 100 characters"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(1000, "Description must be less than 1000 characters"),
	price: z.number().min(1, "Price must be greater than 0"),
	discount: z
		.number()
		.min(0, "Discount must be at least 0")
		.max(100, "Discount cannot exceed 100%"),
	tag: z.enum(["NEW", "TRENDING", "MOST_LIKED", "POPULAR", "PREMIUM"]),
	category: z.string().min(1, "Category is required"),
	availableModel: z.string().min(1, "Available model is required"),
	variants: z
		.array(productVariantSchema)
		.min(1, "At least one variant is required"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
