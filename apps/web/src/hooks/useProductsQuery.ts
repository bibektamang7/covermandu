import { getProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useProductsQuery = () => {
	return useQuery({
		queryKey: ["products"],
		queryFn: getProducts,
	});
};
