"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClinet } from "@/lib/getQueryClient";

const Provider = ({ children }: { children: React.ReactNode }) => {
	const queryClient = getQueryClinet();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export default Provider;
