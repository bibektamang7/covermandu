// Integration tests
import axios from "axios";
const baseurl = "http://localhost:8000/api/v1";

describe("Wishlist Controller - Integration Tests", () => {
	let userToken: string = "";
	let productId: string = "";
	let wishlistId: string = "";

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

			const productsResponse = await axios.get(`${baseurl}/products`);
			productId = productsResponse.data.products[0].id;

			const response = await axios.post(
				`${baseurl}/wishlists`,
				{ productId },
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			);

			wishlistId = response.data.wishlist.id;
		} catch (error) {
			throw new Error(`something went wrong in before all${error}`);
		}
	});

	it("POST /api/v1/wishlists - should add item to wishlist", async () => {
		const response = await axios.post(
			`${baseurl}/wishlists`,
			{ productId },
			{
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			}
		);

		expect(response.status).toEqual(200);
		expect(response.data).toHaveProperty("message");
		expect(response.data.wishlist).toHaveProperty("id");
	});

	it("GET /api/v1/wishlists - should get all wishlist items", async () => {
		const response = await axios.get(`${baseurl}/wishlists`, {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});

		expect(response.status).toBe(200);
		expect(response.data.length).toBeGreaterThanOrEqual(1);
	});

	it("DELETE /api/v1/wishlists/:id - should delete a wishlist item", async () => {
		const response = await axios.delete(`${baseurl}/wishlists/${wishlistId}`, {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});

		expect(response.status).toBe(200);
	});

	it("POST /api/v1/wishlists - should return 401 when adding to wishlist without authentication", async () => {
		try {
			await axios.post(`${baseurl}/wishlists`, { productId });
		} catch (error: any) {
			expect(error.response.status).toBe(401);
		}
	});

	it("POST /api/v1/wishlists - should return 400 when adding a product that does not exist", async () => {
		try {
			await axios.post(
				`${baseurl}/wishlists`,
				{ productId: "nonexistentid" },
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			);
		} catch (error: any) {
			expect(error.response.status).toBe(400);
		}
	});

	it("DELETE /api/v1/wishlists/:id - should return 404 for non-existent wishlist item", async () => {
		try {
			await axios.delete(`${baseurl}/wishlists/nonexistentid`, {
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			});
		} catch (error: any) {
			expect(error.response.status).toBe(404);
		}
	});
});
