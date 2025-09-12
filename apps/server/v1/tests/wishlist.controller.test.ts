import type { Request, Response } from "express";
import { prisma } from "../db/index";
import {
	getWishlistItems,
	addToWishList,
	getWishlist,
	deleteWishlistItem,
} from "../controllers/wishlist.controller";
import express from "express";
import request from "supertest";
import wishlistRoutes from "../routes/wishlist.route";

jest.mock("../db", () => ({
	prisma: {
		wishlist: {
			findMany: jest.fn(),
			upsert: jest.fn(),
			delete: jest.fn(),
		},
	},
}));

jest.mock("../middlewares/auth.middleware", () => ({
	authenticateUser: (req: Request, res: Response, next: () => void) => {
		req.user = { id: "user1", email: "test@test.com", role: "USER" };
		next();
	},
}));

const mockRequest = (body = {}, params = {}, user = {}) =>
	({
		body,
		params,
		user,
	}) as unknown as Request;

const mockResponse = () => {
	const res: any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res as Response;
};

describe("Wishlist Controller - Unit Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getWishlistItems", () => {
		it("should return wishlist items for a user", async () => {
			const req = mockRequest({}, {}, { id: "user1" });
			const res = mockResponse();
			(prisma.wishlist.findMany as jest.Mock).mockResolvedValue([
				{ id: "wish1" },
			]);

			await getWishlistItems(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(expect.any(Array));
		});
	});

	describe("addToWishList", () => {
		it("should add an item to the wishlist", async () => {
			const req = mockRequest(
				{ productVariantId: "variant1" },
				{},
				{ id: "user1" }
			);
			const res = mockResponse();
			(prisma.wishlist.upsert as jest.Mock).mockResolvedValue({ id: "wish1" });

			await addToWishList(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: "Product added to wishlist" });
		});
	});

	describe("getWishlist", () => {
		it("should return the user's wishlist", async () => {
			const req = mockRequest({}, {}, { id: "user1" });
			const res = mockResponse();
			(prisma.wishlist.findMany as jest.Mock).mockResolvedValue([
				{ id: "wish1" },
			]);

			await getWishlist(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(expect.any(Array));
		});
	});

	describe("deleteWishlistItem", () => {
		it("should delete an item from the wishlist", async () => {
			const req = mockRequest({}, { id: "wish1" }, { id: "user1" });
			const res = mockResponse();
			(prisma.wishlist.delete as jest.Mock).mockResolvedValue({ id: "wish1" });

			await deleteWishlistItem(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: "Wishlist item removed" });
		});
	});
});

// Integration tests
const app = express();
app.use(express.json());
app.use("/api/v1/wishlists", wishlistRoutes);

describe("Wishlist Controller - Integration Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("GET /api/v1/wishlists - should get all wishlist items", async () => {
		(prisma.wishlist.findMany as jest.Mock).mockResolvedValue([
			{ id: "wish1" },
		]);

		const res = await request(app)
			.get("/api/v1/wishlists")
			.set("Authorization", "Bearer fake-token");

		expect(res.statusCode).toEqual(200);
		expect(res.body.length).toBe(1);
	});

	it("POST /api/v1/wishlists - should add item to wishlist", async () => {
		(prisma.wishlist.upsert as jest.Mock).mockResolvedValue({ id: "wish1" });

		const res = await request(app)
			.post("/api/v1/wishlists")
			.set("Authorization", "Bearer fake-token")
			.send({ productVariantId: "variant1" });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ message: "Product added to wishlist" });
	});

	it("DELETE /api/v1/wishlists/:id - should delete a wishlist item", async () => {
		(prisma.wishlist.delete as jest.Mock).mockResolvedValue({ id: "wish1" });

		const res = await request(app)
			.delete("/api/v1/wishlists/wish1")
			.set("Authorization", "Bearer fake-token");

		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ message: "Wishlist item removed" });
	});
});