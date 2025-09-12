import type { Request, Response } from "express";
import { prisma } from "../db/index";
import {
	createReview,
	getReviewsByProduct,
	getUserReviews,
} from "../controllers/review.controller";
import { createReviewSchema } from "../validation/review.validation";
import express from "express";
import request from "supertest";
import reviewRoutes from "../routes/review.route";

jest.mock("../db", () => ({
	prisma: {
		review: {
			create: jest.fn(),
			findMany: jest.fn(),
		},
	},
}));

jest.mock("../validation/review.validation", () => ({
	createReviewSchema: {
		safeParse: jest.fn(),
	},
}));

jest.mock("../middlewares/auth.middleware", () => ({
	authenticateUser: (req: Request, res: Response, next: () => void) => {
		req.user = { id: "user1", email: "test@test.com", role: "USER" };
		next();
	},
}));

const mockRequest = (body = {}, params = {}, query = {}, user = {}) =>
	({
		body,
		params,
		query,
		user,
	}) as unknown as Request;

const mockResponse = () => {
	const res: any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res as Response;
};

describe("Review Controller - Unit Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("createReview", () => {
		it("should create a new review", async () => {
			const req = mockRequest({
				message: "Great product!",
				productId: "prod1",
				reviewerId: "user1",
				stars: 5,
			});
			const res = mockResponse();
			(createReviewSchema.safeParse as jest.Mock).mockReturnValue({
				success: true,
				data: {
					message: "Great product!",
					productId: "prod1",
					reviewerId: "user1",
					stars: 5,
				},
			});
			(prisma.review.create as jest.Mock).mockResolvedValue({ id: "review1" });

			await createReview(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ message: "Review created successfully" })
			);
		});
	});

	describe("getReviewsByProduct", () => {
		it("should return reviews for a product", async () => {
			const req = mockRequest({}, { productId: "prod1" }, { page: "1", limit: "5" });
			const res = mockResponse();
			(prisma.review.findMany as jest.Mock).mockResolvedValue([
				{ id: "review1" },
			]);

			await getReviewsByProduct(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ data: { reviews: expect.any(Array) } })
			);
		});
	});

	describe("getUserReviews", () => {
		it("should return reviews for a user", async () => {
			const req = mockRequest({}, {}, {}, { id: "user1" });
			const res = mockResponse();
			(prisma.review.findMany as jest.Mock).mockResolvedValue([
				{ id: "review1" },
			]);

			await getUserReviews(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ data: { reviews: expect.any(Array) } })
			);
		});
	});
});

// Integration tests
const app = express();
app.use(express.json());
app.use("/api/v1/reviews", reviewRoutes);

describe("Review Controller - Integration Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("POST /api/v1/reviews - should create a review", async () => {
		(createReviewSchema.safeParse as jest.Mock).mockReturnValue({
			success: true,
			data: { stars: 5, message: "Excellent!" },
		});
		(prisma.review.create as jest.Mock).mockResolvedValue({ id: "review1" });

		const res = await request(app)
			.post("/api/v1/reviews")
			.set("Authorization", "Bearer fake-token")
			.send({ stars: 5, message: "Excellent!" });

		expect(res.statusCode).toEqual(200);
		expect(res.body.data.review).toHaveProperty("id", "review1");
	});

	it("GET /api/v1/reviews/product/:productId - should get reviews for a product", async () => {
		(prisma.review.findMany as jest.Mock).mockResolvedValue([
			{ id: "review1" },
		]);

		const res = await request(app).get("/api/v1/reviews/product/prod1");

		expect(res.statusCode).toEqual(200);
		expect(res.body.data.reviews.length).toBe(1);
	});

	it("GET /api/v1/reviews - should get reviews for a user", async () => {
		(prisma.review.findMany as jest.Mock).mockResolvedValue([
			{ id: "review1" },
		]);

		const res = await request(app)
			.get("/api/v1/reviews")
			.set("Authorization", "Bearer fake-token");

		expect(res.statusCode).toEqual(200);
		expect(res.body.data.reviews.length).toBe(1);
	});
});