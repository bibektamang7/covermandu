import type { Request, Response } from "express";
import { prisma } from "db";
import {
	addToCart,
	getCartItems,
	updateCartItem,
	deleteCartItem,
} from "../controllers/cart.controller";
import { addToCartSchema } from "../validation/cart.validation";

jest.mock("db", () => ({
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

});

// Integration tests
import axios from "axios";
const baseurl = "http://localhost:8000/api/v1";

describe("Cart Controller - Integration Tests", () => {
	let productVariantId: string = "";
	let userToken: string = "";
	let cartId: string = "";

	beforeAll(async () => {
		try {
			const signupResponse = await axios.post(`${baseurl}/users/register`, {
				name: `bibek-${Math.random().toPrecision(4)}`,
				email: `bibek-${Math.random().toPrecision(3)}@gmail.com`,
				googleId: `google-${Math.random().toString(36).substring(2, 10)}`,
				image:
					"https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
			});
			console.log("this is signup response", signupResponse);

			userToken = signupResponse.data.token;
			// userId = signupResponse.data.user.id;

			const productsResponse = await axios.get(`${baseurl}/products`);
			console.log(
				"this is variant id",
				productsResponse.data.products[0].variants[0].id
			);
			productVariantId = productsResponse.data.products[0].variants[0].id;

			const response = await axios.post(
				`${baseurl}/carts`,
				{
					productVariantId: productVariantId,
					quantity: 1,
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			);
			cartId = response.data.id;
		} catch (error) {
			throw new Error(`something went wrong in before all${error}`);
		}
	});

	it("POST /api/v1/carts - should add item to cart", async () => {
		const quantity = 1;

		const response = await axios.post(
			`${baseurl}/carts`,
			{
				productVariantId: productVariantId,
				quantity,
			},
			{
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			}
		);

		console.log("this is response data", response.data);
		expect(response.status).toEqual(200);
		// expect(response.data).toHaveProperty("id", "quantity");
		expect(response.data.quantity).toBe(quantity);
	});

	it("GET /api/v1/carts - should get all cart items", async () => {
		const response = await axios.get(`${baseurl}/carts`, {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});

		expect(response.status).toBe(200);
		expect(response.data.length).toBeGreaterThanOrEqual(1);
	});

	it("PUT /api/v1/carts/:cartId - should update cart item", async () => {
		console.log("this is cartid in put", cartId);
		const quantity = 1;
		const response = await axios.put(
			`${baseurl}/carts/${cartId}`,
			{
				quantity,
			},
			{
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			}
		);

		expect(response.status).toBe(200);
		expect(response.data).toHaveProperty("id");
	});

	it("DELETE /api/v1/carts/:cartId - should delete cart item", async () => {
		const response = await axios.delete(`${baseurl}/carts/${cartId}`, {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});

		expect(response.status).toBe(200);
	});

	it("POST /api/v1/carts - should return 401 when adding to cart without authentication", async () => {
		try {
			await axios.post(`${baseurl}/carts`, {
				productVariantId: productVariantId,
				quantity: 1,
			});
		} catch (error: any) {
			expect(error.response.status).toBe(401);
		}
	});

	it("PUT /api/v1/carts/:cartId - should return 404 for non-existent cart item", async () => {
		try {
			await axios.put(
				`${baseurl}/carts/nonexistentid`,
				{
					quantity: 1,
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			);
		} catch (error: any) {
			expect(error.response.status).toBe(404);
		}
	});

	it("DELETE /api/v1/carts/:cartId - should return 404 for non-existent cart item", async () => {
		try {
			await axios.delete(`${baseurl}/carts/nonexistentid`, {
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			});
		} catch (error: any) {
			expect(error.response.status).toBe(404);
		}
	});
});
