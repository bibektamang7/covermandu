import { auth } from "@/app/api/auth/[...nextauth]/auth";
import axios from "axios";

const baseURL =
	process.env.NEXT_PUBLIC_BACKEND_BASE_URL || process.env.BACKEND_BASE_URL;

if (!baseURL) {
	throw new Error("Backend base URL is not configured");
}

const apiClient = axios.create({
	baseURL,
	timeout: 10000,
});

export default apiClient;
