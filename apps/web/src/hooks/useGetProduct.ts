import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

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
