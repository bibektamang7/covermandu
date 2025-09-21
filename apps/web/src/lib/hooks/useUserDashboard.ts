import { useQuery } from "@tanstack/react-query";
import { getUserDashboard } from "../api";

export const useUserDashboard = () => {
	return useQuery({
		queryKey: ["userDashboard"],
		queryFn: getUserDashboard,
	});
};