"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClinet } from "@/lib/getQueryClient";
import { SessionProvider } from "next-auth/react";
import CartProvider from "@/context/cartContext";

const Provider = ({ children }: { children: React.ReactNode }) => {
	const queryClient = getQueryClinet();

	return (
		<SessionProvider
			refetchInterval={60}
			refetchOnWindowFocus={true}
		>
			<QueryClientProvider client={queryClient}>
				<CartProvider>{children}</CartProvider>
			</QueryClientProvider>
		</SessionProvider>
	);
};

export default Provider;
