import apiClient from "./apiClient";

export async function getProducts(params?: {
  search?: string;
  category?: string;
  phoneModel?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append("search", params.search);
  if (params?.category) queryParams.append("category", params.category);
  if (params?.phoneModel) queryParams.append("phoneModel", params.phoneModel);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.order) queryParams.append("order", params.order);

  const { data } = await apiClient.get(`/products?${queryParams.toString()}`);
  return data;
}

export async function getAllUsers() {
  const { data } = await apiClient.get("/users/all");
  return data.users;
}

export async function getUserDashboard() {
  const { data } = await apiClient.get("/users/dashboard");
  return data;
}
