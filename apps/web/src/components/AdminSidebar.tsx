"use client";
import { Package, Users, BarChart3, Settings, Plus } from "lucide-react";
import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarHeader,
	useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
	{ title: "Products", url: "/admin", icon: Package },
	{ title: "Users", url: "/admin/users", icon: Users },
	{ title: "Add Product", url: "/admin/add-product", icon: Plus },
	{ title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
	{ title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
	const { state } = useSidebar();
	return (
		<Sidebar
			className={state === "collapsed" ? "w-14" : "w-64"}
			collapsible="icon"
		>
			<SidebarHeader className="p-6">
				{state !== "collapsed" && (
					<div>
						<h2 className="text-lg font-semibold">Admin Panel</h2>
						<p className="text-sm text-muted-foreground">Manage your store</p>
					</div>
				)}
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Management</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link
											href={item.url}
											className={""}
										>
											<item.icon className="h-4 w-4" />
											{state !== "collapsed" && <span>{item.title}</span>}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
