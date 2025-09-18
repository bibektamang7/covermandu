import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

interface Review {
	message: string;
	stars: number;
	productId: string;
}

export const usePostReview = (review: Review, token: string) => {
	return useQuery({
		queryKey: ["review"],
		queryFn: async () => {
			const response = await apiClient.post(`/reviews`, review, {
				headers: { Authorization: `Bearer ${token}` },
			});

			return response.data;
		},
	});
};
