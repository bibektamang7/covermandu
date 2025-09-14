import type { Request, Response } from "express";
import { prisma } from "db";
import {
	getProducts,
	createProduct,
	deleteProduct,
	getProductById,
	updateProduct,
} from "../controllers/product.controller";
import {
	createProductSchema,
	updateProductSchema,
} from "../validation/product.validation";
import jwt from "jsonwebtoken";

jest.mock("db", () => ({
	prisma: {
		product: {
			findMany: jest.fn(),
			count: jest.fn(),
			create: jest.fn(),
			delete: jest.fn(),
			findUnique: jest.fn(),
			update: jest.fn(),
		},
		user: {
			findUnique: jest.fn(),
		},
		wishlist: {
			findFirst: jest.fn(),
		},
	},
}));

jest.mock("../validation/product.validation", () => ({
	createProductSchema: {
		safeParse: jest.fn(),
	},
	updateProductSchema: {
		safeParse: jest.fn(),
	},
}));

jest.mock("jsonwebtoken", () => ({
	verify: jest.fn(),
}));

jest.mock("../middlewares/auth.middleware", () => ({
	authenticateUser: (req: Request, res: Response, next: () => void) => {
		req.user = { id: "user1", email: "test@test.com", role: "USER" };
		next();
	},
	authenticateAdmin: (req: Request, res: Response, next: () => void) => {
		req.user = { id: "admin1", email: "admin@test.com", role: "ADMIN" };
		next();
	},
}));

const mockRequest = (
	body = {},
	params = {},
	query = {},
	headers = {},
	user = {}
) =>
	({
		body,
		params,
		query,
		headers,
		user,
	}) as unknown as Request;

const mockResponse = () => {
	const res: any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res as Response;
};

describe("Product Controller - Unit Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getProducts", () => {
		it("should return a list of products", async () => {
			const req = mockRequest({}, {}, { page: "1", limit: "10" });
			const res = mockResponse();
			(prisma.product.findMany as jest.Mock).mockResolvedValue([
				{ id: "prod1", name: "Product 1" },
			]);
			(prisma.product.count as jest.Mock).mockResolvedValue(1);

			await getProducts(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ products: expect.any(Array) })
			);
		});
	});

	describe("createProduct", () => {
		it("should create a new product", async () => {
			const productData = {
				name: "New Product",
				description: "A new product",
				price: 100,
				variants: [
					{
						color: "Red",
						stock: 10,
						image: "red.jpg",
					},
				],
			};
			const req = mockRequest(productData);
			const res = mockResponse();
			(createProductSchema.safeParse as jest.Mock).mockReturnValue({
				success: true,
				data: productData,
			});
			(prisma.product.create as jest.Mock).mockResolvedValue({
				id: "prod1",
				name: "New Product",
			});

			await createProduct(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				message: "Product created successfully",
			});
		});
	});

	describe("deleteProduct", () => {
		it("should delete a product", async () => {
			const req = mockRequest({}, { productId: "prod1" });
			const res = mockResponse();
			(prisma.product.delete as jest.Mock).mockResolvedValue({ id: "prod1" });

			await deleteProduct(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: "Product deleted" });
		});
	});

	describe("getProductById", () => {
		it("should return a single product", async () => {
			const req = mockRequest(
				{},
				{ productId: "prod1" },
				{},
				{ authorization: "Bearer token" }
			);
			const res = mockResponse();
			(jwt.verify as jest.Mock).mockReturnValue({ id: "user1" });
			(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "user1" });
			(prisma.product.findUnique as jest.Mock).mockResolvedValue({
				id: "prod1",
				name: "Product 1",
			});
			(prisma.wishlist.findFirst as jest.Mock).mockResolvedValue(null);

			await getProductById(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ product: expect.any(Object) })
			);
		});
	});

	describe("updateProduct", () => {
		it("should update a product", async () => {
			const req = mockRequest(
				{ name: "Updated Product" },
				{ productId: "prod1" }
			);
			const res = mockResponse();
			(updateProductSchema.safeParse as jest.Mock).mockReturnValue({
				success: true,
				data: { name: "Updated Product" },
			});
			(prisma.product.update as jest.Mock).mockResolvedValue({
				id: "prod1",
				name: "Updated Product",
			});

			await updateProduct(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				message: "Product updated successfully",
			});
		});
	});
});

// Integration tests
import axios from "axios";
const baseurl = "http://localhost:8000/api/v1";

describe("Product Controller - Integration Tests", () => {
	let productId: string = "";
	let adminToken: string = "";

	beforeAll(async () => {
		try {
			const signInResponse = await axios.post(`${baseurl}/users/login`, {
				email: "tmgbibek777@gmail.com",
				googleId: `google-jdk7ihoj`,
			});

			adminToken = signInResponse.data.token;

			const newProduct = {
				name: "Integration Test Product",
				description: "A product created during integration tests.",
				price: parseInt("899"),
				variants: [
					{
						color: "Test Color",
						stock: 100,
						image:
							"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzSzOGxpVBRgl29As6-s7eqaCCEqK5-FQBQ&s",
					},
				],
			};
			const response = await axios.post(`${baseurl}/products`, newProduct, {
				headers: {
					Authorization: `Bearer ${adminToken}`,
				},
			});
			console.log("this is admin create product response", response);
			// const productsResponse = await axios.get(`${baseurl}/products`);
			// console.log("product", productsResponse.data);
			// productId = productsResponse.data.products[0].id;
		} catch (error) {
			throw new Error(`Failed in before all: ${error}`);
		}
	});



	it("GET /api/v1/products - should get all products", async () => {
		const response = await axios.get(`${baseurl}/products`);

		expect(response.status).toBe(200);
		expect(response.data.products.length).toBeGreaterThanOrEqual(1);
	});

	// it("GET /api/v1/products/:productId - should get a product by id", async () => {
	// 	// const productsResponse = await axios.get(`${baseurl}/products`);
	// 	// const productId = productsResponse.data.products[0].id;
	// 	const response = await axios.get(`${baseurl}/products/${productId}`);

	// 	expect(response.status).toBe(200);
	// 	expect(response.data.product).toHaveProperty("id", productId);
	// });

	// it("POST /api/v1/products - should create a new product (admin only)", async () => {
	// 	const newProduct = {
	// 		name: "Integration Test Product",
	// 		description: "A product created during integration tests.",
	// 		price: 123.45,
	// 		variants: [
	// 			{
	// 				color: "Test Color",
	// 				stock: 100,
	// 				image:
	// 					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzSzOGxpVBRgl29As6-s7eqaCCEqK5-FQBQ&s",
	// 			},
	// 		],
	// 	};

	// 	try {
	// 		const response = await axios.post(`${baseurl}/products`, newProduct, {
	// 			headers: {
	// 				Authorization: `Bearer ${adminToken}`,
	// 			},
	// 		});

	// 		expect(response.status).toBe(200); // Or 201 if you prefer
	// 		expect(response.data.message).toBe("Product created successfully");
	// 	} catch (error: any) {
	// 		// Fail test if admin token is not valid
	// 		if (error.response && error.response.status === 403) {
	// 			throw new Error(
	// 				"Admin credentials might be missing or invalid in beforeAll."
	// 			);
	// 		}
	// 		throw error;
	// 	}
	// });

	// it("PUT /api/v1/products/:productId - should update a product (admin only)", async () => {
	// 	const updatedData = {
	// 		name: "Updated Integration Test Product",
	// 	};

	// 	try {
	// 		const response = await axios.put(
	// 			`${baseurl}/products/${productId}`,
	// 			updatedData,
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${adminToken}`,
	// 				},
	// 			}
	// 		);

	// 		expect(response.status).toBe(200);
	// 		expect(response.data.message).toBe("Product updated successfully");

	// 		// Verify the update
	// 		const verifyResponse = await axios.get(
	// 			`${baseurl}/products/${productId}`
	// 		);
	// 		expect(verifyResponse.data.product.name).toBe(
	// 			"Updated Integration Test Product"
	// 		);
	// 	} catch (error: any) {
	// 		if (error.response && error.response.status === 403) {
	// 			throw new Error(
	// 				"Admin credentials might be missing or invalid in beforeAll."
	// 			);
	// 		}
	// 		throw error;
	// 	}
	// });

	// it("DELETE /api/v1/products/:productId - should delete a product (admin only)", async () => {
	// 	// This test will delete the product fetched in `beforeAll`.
	// 	// For more robust tests, consider creating a new product here and deleting it.
	// 	// However, the current create endpoint doesn't return the new product's ID.
	// 	try {
	// 		const response = await axios.delete(`${baseurl}/products/${productId}`, {
	// 			headers: {
	// 				Authorization: `Bearer ${adminToken}`,
	// 			},
	// 		});

	// 		expect(response.status).toBe(200);
	// 		expect(response.data.message).toBe("Product deleted");

	// 		// Verify deletion by expecting a 404
	// 		await expect(
	// 			axios.get(`${baseurl}/products/${productId}`)
	// 		).rejects.toThrow("Request failed with status code 404");
	// 	} catch (error: any) {
	// 		if (error.response && error.response.status === 403) {
	// 			throw new Error(
	// 				"Admin credentials might be missing or invalid in beforeAll."
	// 			);
	// 		}
	// 		throw error;
	// 	}
	// });
});
