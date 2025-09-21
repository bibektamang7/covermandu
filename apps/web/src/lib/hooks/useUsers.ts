import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api";

export const useUsers = () => {
	return useQuery({
		queryKey: ["users"],
		queryFn: getAllUsers,
	});
};