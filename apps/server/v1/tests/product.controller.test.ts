import type { Request, Response } from "express";
import { prisma } from "../db/index";
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
import express from "express";
import request from "supertest";
import productRoutes from "../routes/product.route";

jest.mock("../db", () => ({
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
				expect.objectContaining({ data: expect.any(Array) })
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
const app = express();
app.use(express.json());
app.use("/api/v1/products", productRoutes);

describe("Product Controller - Integration Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("GET /api/v1/products - should get all products", async () => {
		(prisma.product.findMany as jest.Mock).mockResolvedValue([
			{ id: "prod1", name: "Product 1" },
		]);
		(prisma.product.count as jest.Mock).mockResolvedValue(1);

		const res = await request(app).get("/api/v1/products");

		expect(res.statusCode).toEqual(200);
		expect(res.body.data.length).toBe(1);
	});

	it("POST /api/v1/products - should create a product", async () => {
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
		(createProductSchema.safeParse as jest.Mock).mockReturnValue({
			success: true,
			data: productData,
		});
		(prisma.product.create as jest.Mock).mockResolvedValue({ id: "prod1" });

		const res = await request(app)
			.post("/api/v1/products")
			.set("Authorization", "Bearer fake-admin-token")
			.send(productData);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ message: "Product created successfully" });
	});

	it("GET /api/v1/products/:productId - should get a product by id", async () => {
		(prisma.product.findUnique as jest.Mock).mockResolvedValue({
			id: "prod1",
			name: "Product 1",
		});

		const res = await request(app).get("/api/v1/products/prod1");

		expect(res.statusCode).toEqual(200);
		expect(res.body.product).toHaveProperty("id", "prod1");
	});

	it("PUT /api/v1/products/:productId - should update a product", async () => {
		(updateProductSchema.safeParse as jest.Mock).mockReturnValue({
			success: true,
			data: { name: "Updated Product" },
		});
		(prisma.product.update as jest.Mock).mockResolvedValue({ id: "prod1" });

		const res = await request(app)
			.put("/api/v1/products/prod1")
			.set("Authorization", "Bearer fake-admin-token")
			.send({ name: "Updated Product" });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ message: "Product updated successfully" });
	});

	it("DELETE /api/v1/products/:productId - should delete a product", async () => {
		(prisma.product.delete as jest.Mock).mockResolvedValue({ id: "prod1" });

		const res = await request(app)
			.delete("/api/v1/products/prod1")
			.set("Authorization", "Bearer fake-admin-token");

		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ message: "Product deleted" });
	});
});