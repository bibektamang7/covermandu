import apiClient from "./apiClient";

export async function getProducts() {
	const { data } = await apiClient.get(`/products`);
	return data;
}
