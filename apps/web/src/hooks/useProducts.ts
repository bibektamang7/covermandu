import { getProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export const useProductsQuery = (params?: {
	search?: string;
	category?: string;
	phoneModel?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	order?: "asc" | "desc";
}) => {
	return useQuery({
		queryKey: ["products", params],
		queryFn: () => getProducts(params),
	});
};

export const useGetUserDetails = () => {};

export const useGetProduct = (productId: string, token?: string) => {
	return useQuery({
		queryKey: [`product-${productId}`],
		queryFn: async () => {
			const response = await apiClient.get(`/products/${productId}`, {
				headers: {
					Authorization: `Bearer ${token ?? ""}`,
				},
			});

			return response.data;
		},
	});
};
