import { auth } from "@/app/api/auth/[...nextauth]/auth";
import axios from "axios";

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
	timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
	const session = await auth();

	if (session?.user?.token) {
		config.headers.Authorization = `Bearer ${session.user.token}`;
	}

	return config;
});

export default apiClient;
