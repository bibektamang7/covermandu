"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React from "react";
const queryClient = new QueryClient();

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider
				refetchInterval={60}
				// refetchOnWindowFocus={true}
			>
				{children}
			</SessionProvider>
		</QueryClientProvider>
	);
};

export default PageWrapper;
