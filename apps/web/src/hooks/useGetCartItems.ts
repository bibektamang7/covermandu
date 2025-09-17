import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useGetCartItems = (token: string) => {
	return useQuery({
		queryKey: ["cartItems"],
		queryFn: async () => {
			const response = await apiClient.get("/carts", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		},
	});
};
