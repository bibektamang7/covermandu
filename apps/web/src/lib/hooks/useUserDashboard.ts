import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

export const useUserDashboard = (token: string) => {
	return useQuery({
		queryKey: ["userDashboard"],
		queryFn: async () => {
			const { data } = await apiClient.get("/users/dashboard", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return data;
		},
	});
};
