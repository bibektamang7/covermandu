import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Product } from "@/types/product";

interface SearchProductsParams {
  search?: string;
  page?: number;
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

interface SearchProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const useSearchProducts = ({
  search = "",
  page = 1,
  limit = 10,
  skip = 0,
  sortBy = "name",
  order = "asc",
}: SearchProductsParams) => {
  return useQuery({
    queryKey: ["search-products", search, page, limit, skip, sortBy, order],
    queryFn: async () => {
      if (!search.trim()) {
        return { products: [], total: 0, skip: 0, limit: 0 };
      }

      const params = new URLSearchParams();
      params.append("search", search);
      params.append("limit", limit.toString());
      params.append("skip", skip.toString());
      params.append("sortBy", sortBy);
      params.append("order", order);

      const response = await apiClient.get<SearchProductsResponse>(
        `/products?${params.toString()}`
      );

      return response.data;
    },
    enabled: !!search.trim(), // Only run query when search term is not empty
  });
};