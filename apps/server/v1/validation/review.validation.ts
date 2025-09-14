import * as z from "zod";
export const createReviewSchema = z.object({
	message: z.string(),
	stars: z.number().min(0).max(5),
	reviewerId: z.string(),
	productId: z.string(),
});
