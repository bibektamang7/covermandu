import { getProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export const useProductsQuery = () => {
	return useQuery({
		queryKey: ["products"],
		queryFn: getProducts,
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
