import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full">
				<AdminSidebar />
				<div className="flex-1 flex flex-col">
					<header className="h-16 border-b bg-background flex items-center px-6">
						<SidebarTrigger />
						<div className="ml-4">
							<h1 className="text-xl font-semibold">Admin Dashboard</h1>
						</div>
					</header>
					<QueryClientProvider client={queryClient}>
						<main className="flex-1 p-6 bg-muted/30">{children}</main>
					</QueryClientProvider>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default layout;
