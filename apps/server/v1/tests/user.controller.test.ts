import type { Request, Response } from "express";
import { prisma } from "../db/index";
import {
	loginUser,
	registerUser,
	getUser,
} from "../controllers/user.controller";
import {
	loginUserSchema,
	registerUserSchema,
} from "../validation/user.validation";
import jwt from "jsonwebtoken";
import express from "express";
import request from "supertest";
import userRoutes from "../routes/user.route";

jest.mock("../db", () => ({
	prisma: {
		user: {
			findUnique: jest.fn(),
			create: jest.fn(),
		},
	},
}));

jest.mock("../validation/user.validation", () => ({
	loginUserSchema: {
		safeParse: jest.fn(),
	},
	registerUserSchema: {
		safeParse: jest.fn(),
	},
}));

jest.mock("jsonwebtoken", () => ({
	sign: jest.fn(),
}));

jest.mock("../middlewares/auth.middleware", () => ({
	authenticateUser: (req: Request, res: Response, next: () => void) => {
		req.user = { id: "user1", email: "test@test.com", role: "USER" };
		next();
	},
}));

const mockRequest = (body = {}, user = {}) =>
	({
		body,
		user,
	}) as unknown as Request;

const mockResponse = () => {
	const res: any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res as Response;
};

describe("User Controller - Unit Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("loginUser", () => {
		it("should login an existing user", async () => {
			const req = mockRequest({
				email: "test@example.com",
				googleId: "google123",
			});
			const res = mockResponse();
			(loginUserSchema.safeParse as jest.Mock).mockReturnValue({
				success: true,
				data: { email: "test@example.com", googleId: "google123" },
			});
			(prisma.user.findUnique as jest.Mock).mockResolvedValue({
				id: "user1",
				email: "test@example.com",
			});
			(jwt.sign as jest.Mock).mockReturnValue("token");

			await loginUser(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ token: "token" })
			);
		});
	});

	describe("registerUser", () => {
		it("should register a new user", async () => {
			const req = mockRequest({
				name: "Test User",
				email: "test@example.com",
				googleId: "google123",
			});
			const res = mockResponse();
			(registerUserSchema.safeParse as jest.Mock).mockReturnValue({
				success: true,
				data: {
					name: "Test User",
					email: "test@example.com",
					googleId: "google123",
				},
			});
			(prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
			(prisma.user.create as jest.Mock).mockResolvedValue({
				id: "user1",
				name: "Test User",
			});
			(jwt.sign as jest.Mock).mockReturnValue("token");

			await registerUser(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ token: "token" })
			);
		});
	});

	describe("getUser", () => {
		it("should return the authenticated user", () => {
			const req = mockRequest({}, { id: "user1", name: "Test User" });
			const res = mockResponse();

			getUser(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ user: { id: "user1", name: "Test User" } });
		});
	});
});

// Integration tests
const app = express();
app.use(express.json());
app.use("/api/v1/users", userRoutes);

describe("User Controller - Integration Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("POST /api/v1/users/login - should login a user", async () => {
		(loginUserSchema.safeParse as jest.Mock).mockReturnValue({
			success: true,
			data: { email: "test@example.com", googleId: "google123" },
		});
		(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "user1" });
		(jwt.sign as jest.Mock).mockReturnValue("token");

		const res = await request(app)
			.post("/api/v1/users/login")
			.send({ email: "test@example.com", googleId: "google123" });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("token", "token");
	});

	it("POST /api/v1/users/register - should register a user", async () => {
		(registerUserSchema.safeParse as jest.Mock).mockReturnValue({
			success: true,
			data: { name: "Test User" },
		});
		(prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
		(prisma.user.create as jest.Mock).mockResolvedValue({ id: "user1" });
		(jwt.sign as jest.Mock).mockReturnValue("token");

		const res = await request(app)
			.post("/api/v1/users/register")
			.send({ name: "Test User" });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("token", "token");
	});

	it("GET /api/v1/users - should get current user", async () => {
		const res = await request(app)
			.get("/api/v1/users")
			.set("Authorization", "Bearer fake-token");

		expect(res.statusCode).toEqual(200);
		expect(res.body.user).toHaveProperty("id", "user1");
	});
});