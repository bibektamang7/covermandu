// Integration tests
import axios from "axios";
const baseurl = "http://localhost:8000/api/v1";

describe("Review Controller - Integration Tests", () => {
	let userToken: string = "";
	let productId: string = "";
	let userId: string = "";

	beforeAll(async () => {
		try {
			const signupResponse = await axios.post(`${baseurl}/users/register`, {
				name: `bibek-${Math.random().toPrecision(4)}`,
				email: `bibek-${Math.random().toPrecision(3)}@gmail.com`,
				googleId: `google-${Math.random().toString(36).substring(2, 10)}`,
				image:
					"https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
			});
			userToken = signupResponse.data.token;
			userId = signupResponse.data.user.id;

			const productsResponse = await axios.get(`${baseurl}/products`);
			productId = productsResponse.data.products[0].id;
		} catch (error) {
			throw new Error(`something went wrong in before all${error}`);
		}
	});

	it("POST /api/v1/reviews - should create a review", async () => {
		const reviewData = {
			stars: 5,
			message: "Excellent!",
			productId: productId,
			reviewerId: userId,
		};

		const response = await axios.post(`${baseurl}/reviews`, reviewData, {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});

		expect(response.status).toEqual(200);
		expect(response.data.review).toHaveProperty("id");
	});

	it("GET /api/v1/reviews/product/:productId - should get reviews for a product", async () => {
		const response = await axios.get(`${baseurl}/reviews/product/${productId}`);

		console.log("this is data in get review", response.data)
		expect(response.status).toBe(200);
		expect(response.data.length).toBeGreaterThanOrEqual(1);
	});

	it("GET /api/v1/reviews - should get reviews for a user", async () => {
		const response = await axios.get(`${baseurl}/reviews`, {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});

		expect(response.status).toBe(200);
		expect(response.data.length).toBeGreaterThanOrEqual(1);
	});

	it("POST /api/v1/reviews - should return 401 for creating a review without authentication", async () => {
		const reviewData = {
			stars: 5,
			message: "Excellent!",
			productId: productId,
			reviewerId: userId,
		};

		try {
			await axios.post(`${baseurl}/reviews`, reviewData);
		} catch (error: any) {
			expect(error.response.status).toBe(401);
		}
	});

	it("POST /api/v1/reviews - should return 400 for creating a review with missing fields", async () => {
		const reviewData = {
			stars: 5,
			productId: productId,
			reviewerId: userId,
		};

		try {
			await axios.post(`${baseurl}/reviews`, reviewData, {
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			});
		} catch (error: any) {
			expect(error.response.status).toBe(400);
		}
	});

	it("GET /api/v1/reviews/product/:productId - should return 404 for a non-existent product", async () => {
		try {
			await axios.get(`${baseurl}/reviews/product/nonexistentid`);
		} catch (error: any) {
			expect(error.response.status).toBe(404);
		}
	});
});
