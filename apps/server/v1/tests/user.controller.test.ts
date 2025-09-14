import type { Request, Response } from "express";
import {prisma} from "db"
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

jest.mock("db", () => ({
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
import axios from "axios";
const baseurl = "http://localhost:8000/api/v1";

describe("User Controller - Integration Tests", () => {
	let userToken: string = "";

	it("POST /api/v1/users/register - should register a user", async () => {
		const userData = {
			name: `bibek-${Math.random().toPrecision(4)}`,
			email: `bibek-${Math.random().toPrecision(3)}@gmail.com`,
			googleId: `google-${Math.random().toString(36).substring(2, 10)}`,
			image:
				"https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
		};

		const response = await axios.post(`${baseurl}/users/register`, userData);

		expect(response.status).toEqual(200);
		expect(response.data).toHaveProperty("token");
		userToken = response.data.token;
	});

	it("GET /api/v1/users - should get current user", async () => {
		const response = await axios.get(`${baseurl}/users`, {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});

		expect(response.status).toBe(200);
		expect(response.data).toHaveProperty("user");
	});
});
