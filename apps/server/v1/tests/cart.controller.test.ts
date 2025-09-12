import type { Request, Response } from "express";
import { prisma } from "../db/index";
import {
	addToCart,
	getCartItems,
	updateCartItem,
	deleteCartItem,
} from "../controllers/cart.controller";
import { addToCartSchema } from "../validation/cart.validation";
import express from "express";
import request from "supertest";
import cartRoutes from "../routes/cart.route";

jest.mock("../db", () => ({
	prisma: {
		productVariant: {
			findUnique: jest.fn(),
		},
		cart: {
			upsert: jest.fn(),
			findMany: jest.fn(),
			findUnique: jest.fn(),
			update: jest.fn(),
			deleteMany: jest.fn(),
		},
		user: {
			findUnique: jest.fn(),
		},
	},
}));

jest.mock("../validation/cart.validation", () => ({
	addToCartSchema: {
		safeParse: jest.fn(),
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

describe("Cart Controller - Unit Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("addToCart", () => {
		it("should add an item to the cart successfully", async () => {
			const req = mockRequest(
				{ productVariantId: "variant1", quantity: 1 },
				{},
				{ id: "user1" }
			);
			const res = mockResponse();
			(addToCartSchema.safeParse as jest.Mock).mockReturnValue({
				success: true,
				data: { productVariantId: "variant1", quantity: 1 },
			});
			(prisma.productVariant.findUnique as jest.Mock).mockResolvedValue({
				id: "variant1",
				stock: 10,
			});
			(prisma.cart.upsert as jest.Mock).mockResolvedValue({
				id: "cart1",
				userId: "user1",
				productVariantId: "variant1",
				quantity: 1,
			});

			await addToCart(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ id: "cart1" })
			);
		});

		it("should return 400 on validation error", async () => {
			const req = mockRequest({ productVariantId: "variant1" });
			const res = mockResponse();
			(addToCartSchema.safeParse as jest.Mock).mockReturnValue({
				success: false,
			});

			await addToCart(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: "Validation error" });
		});

		it("should return 404 if product not found", async () => {
			const req = mockRequest(
				{ productVariantId: "nonexistent", quantity: 1 },
				{},
				{ id: "user1" }
			);
			const res = mockResponse();
			(addToCartSchema.safeParse as jest.Mock).mockReturnValue({
				success: true,
				data: { productVariantId: "nonexistent", quantity: 1 },
			});
			(prisma.productVariant.findUnique as jest.Mock).mockResolvedValue(null);

			await addToCart(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
		});

		it("should return 400 if quantity exceeds stock", async () => {
			const req = mockRequest(
				{ productVariantId: "variant1", quantity: 20 },
				{},
				{ id: "user1" }
			);
			const res = mockResponse();
			(addToCartSchema.safeParse as jest.Mock).mockReturnValue({
				success: true,
				data: { productVariantId: "variant1", quantity: 20 },
			});
			(prisma.productVariant.findUnique as jest.Mock).mockResolvedValue({
				id: "variant1",
				stock: 10,
			});

			await addToCart(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				message: "Quantity exceeds available stock",
			});
		});
	});

	describe("getCartItems", () => {
		it("should return all cart items for a user", async () => {
			const req = mockRequest({}, {}, { id: "user1" });
			const res = mockResponse();
			const mockCartItems = [
				{
					id: "cart1",
					userId: "user1",
					productVariant: { Product: { name: "Product 1" } },
				},
			];
			(prisma.cart.findMany as jest.Mock).mockResolvedValue(mockCartItems);

			await getCartItems(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockCartItems);
		});
	});

	describe("updateCartItem", () => {
		it("should update a cart item's quantity", async () => {
			const req = mockRequest(
				{ quantity: 2 },
				{ cartId: "cart1" },
				{ id: "user1" }
			);
			const res = mockResponse();
			(prisma.cart.findUnique as jest.Mock).mockResolvedValue({
				id: "cart1",
				productVariant: { stock: 5 },
			});
			(prisma.cart.update as jest.Mock).mockResolvedValue({
				id: "cart1",
				quantity: 2,
			});

			await updateCartItem(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ quantity: 2 })
			);
		});

		it("should return 404 if cart item not found", async () => {
			const req = mockRequest(
				{ quantity: 2 },
				{ cartId: "nonexistent" },
				{ id: "user1" }
			);
			const res = mockResponse();
			(prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

			await updateCartItem(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "Cart item not found" });
		});
	});

	describe("deleteCartItem", () => {
		it("should delete a cart item", async () => {
			const req = mockRequest({}, { cartId: "cart1" }, { id: "user1" });
			const res = mockResponse();
			(prisma.cart.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

			await deleteCartItem(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: "Cart item deleted" });
		});

		it("should return 400 if cart item to delete is not found", async () => {
			const req = mockRequest({}, { cartId: "nonexistent" }, { id: "user1" });
			const res = mockResponse();
			(prisma.cart.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });

			await deleteCartItem(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				message: "Failed to delete cart item",
			});
		});
	});
});

// Integration tests
const app = express();
app.use(express.json());
app.use("/api/v1/carts", cartRoutes);

describe("Cart Controller - Integration Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("POST /api/v1/carts - should add item to cart", async () => {
		(addToCartSchema.safeParse as jest.Mock).mockReturnValue({
			success: true,
			data: { productVariantId: "variant1", quantity: 1 },
		});
		(prisma.productVariant.findUnique as jest.Mock).mockResolvedValue({
			id: "variant1",
			stock: 10,
		});
		(prisma.cart.upsert as jest.Mock).mockResolvedValue({ id: "cart1" });

		const res = await request(app)
			.post("/api/v1/carts")
			.set("Authorization", "Bearer fake-token")
			.send({ productVariantId: "variant1", quantity: 1 });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("id", "cart1");
	});

	it("GET /api/v1/carts - should get all cart items", async () => {
		(prisma.cart.findMany as jest.Mock).mockResolvedValue([
			{ id: "cart1", quantity: 1 },
		]);

		const res = await request(app)
			.get("/api/v1/carts")
			.set("Authorization", "Bearer fake-token");

		expect(res.statusCode).toEqual(200);
		expect(res.body.length).toBe(1);
	});

	it("PUT /api/v1/carts/:cartId - should update cart item", async () => {
		(prisma.cart.findUnique as jest.Mock).mockResolvedValue({
			id: "cart1",
			productVariant: { stock: 5 },
		});
		(prisma.cart.update as jest.Mock).mockResolvedValue({
			id: "cart1",
			quantity: 5,
		});

		const res = await request(app)
			.put("/api/v1/carts/cart1")
			.set("Authorization", "Bearer fake-token")
			.send({ quantity: 5 });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("quantity", 5);
	});

	it("DELETE /api/v1/carts/:cartId - should delete cart item", async () => {
		(prisma.cart.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

		const res = await request(app)
			.delete("/api/v1/carts/cart1")
			.set("Authorization", "Bearer fake-token");

		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ message: "Cart item deleted" });
	});
});