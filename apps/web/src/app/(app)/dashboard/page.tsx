import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Package,
	ShoppingBag,
	Heart,
	Star,
	MapPin,
	Phone,
	Mail,
	Calendar,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useUserDashboard } from "@/lib/hooks/useUserDashboard";

const Dashboard = () => {
	const { data, isLoading, isError } = useUserDashboard();

	const userStats = data?.stats ? [
		{
			title: "Total Orders",
			value: data.stats.totalOrders.toString(),
			icon: ShoppingBag,
			color: "text-blue-600",
		},
		{
			title: "Active Orders",
			value: "0", // We don't have this data yet
			icon: Package,
			color: "text-orange-600",
		},
		{ 
			title: "Wishlist Items", 
			value: data.stats.wishlistItems.toString(), 
			icon: Heart, 
			color: "text-red-600" 
		},
		{
			title: "Total Reviews",
			value: data.stats.totalReviews.toString(),
			icon: Star,
			color: "text-yellow-600",
		},
	] : [];

	const recentOrders = data?.recentOrders || [];

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "delivered":
				return "bg-green-100 text-green-800";
			case "shipped":
				return "bg-blue-100 text-blue-800";
			case "processing":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-muted/30">
				<Navigation />
				<main className="pt-20 px-16">
					<div className="mx-auto px-6 py-8">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
							<div>
								<h1 className="text-3xl font-bold mb-2">Dashboard</h1>
								<p className="text-muted-foreground">Loading your dashboard...</p>
							</div>
						</div>
						<div className="flex justify-center items-center h-64">
							<p>Loading dashboard data...</p>
						</div>
					</div>
				</main>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-muted/30">
				<Navigation />
				<main className="pt-20 px-16">
					<div className="mx-auto px-6 py-8">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
							<div>
								<h1 className="text-3xl font-bold mb-2">Dashboard</h1>
								<p className="text-muted-foreground">Error loading dashboard</p>
							</div>
						</div>
						<div className="flex justify-center items-center h-64">
							<p>Error loading dashboard data. Please try again later.</p>
						</div>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-muted/30">
			<Navigation />
			<main className="pt-20 px-16">
				<div className="mx-auto px-6 py-8">
					{/* Header */}
					<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
						<div>
							<h1 className="text-3xl font-bold mb-2">Dashboard</h1>
							<p className="text-muted-foreground">Welcome back, {data?.user?.name || "User"}!</p>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
						{/* User Profile Card */}
						<Card className="lg:row-span-2">
							<CardHeader className="text-center">
								<Avatar className="w-20 h-20 mx-auto mb-4">
									<AvatarImage
										src={data?.user?.image || ""}
										alt={data?.user?.name || "User"}
									/>
									<AvatarFallback>
										{data?.user?.name
											?.split(" ")
											.map((n: string) => n[0])
											.join("") || "U"}
									</AvatarFallback>
								</Avatar>
								<CardTitle>{data?.user?.name || "User"}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-3 text-sm">
									<Mail className="w-4 h-4 text-muted-foreground" />
									<span>{data?.user?.email || "user@example.com"}</span>
								</div>
								<div className="flex items-center gap-3 text-sm">
									<Phone className="w-4 h-4 text-muted-foreground" />
									<span>+977 98XXXXXXXX</span>
								</div>
								<div className="flex items-center gap-3 text-sm">
									<MapPin className="w-4 h-4 text-muted-foreground" />
									<span>Kathmandu, Nepal</span>
								</div>
								<div className="flex items-center gap-3 text-sm">
									<Calendar className="w-4 h-4 text-muted-foreground" />
									<span>
										Member since{" "}
										{data?.user?.createdAt
											? new Date(data.user.createdAt).toLocaleDateString()
											: "Unknown"}
									</span>
								</div>
								<Separator />
								<Button
									variant="outline"
									className="w-full"
								>
									Edit Profile
								</Button>
							</CardContent>
						</Card>

						{/* Stats Cards */}
						<div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{userStats.map((stat, index) => (
								<Card key={index}>
									<CardContent className="p-6">
										<div className="flex items-center gap-4">
											<div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
												<stat.icon className="w-6 h-6" />
											</div>
											<div>
												<p className="text-2xl font-bold">{stat.value}</p>
												<p className="text-sm text-muted-foreground">
													{stat.title}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{/* Recent Orders */}
						<Card className="lg:col-span-3">
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
								<CardDescription>Your recent orders</CardDescription>
							</CardHeader>
							<CardContent>
								{recentOrders.length > 0 ? (
									<div className="space-y-4">
										{recentOrders.map((order: any) => (
											<div
												key={order.id}
												className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
											>
												<div>
													<p className="font-medium">{order.id}</p>
													<p className="text-sm text-muted-foreground">
														{order.items}
													</p>
												</div>
												<div className="flex items-center gap-4 mt-2 sm:mt-0">
													<Badge
														className={getStatusColor(order.status)}
														variant="secondary"
													>
														{order.status}
													</Badge>
													<div className="text-right">
														<p className="font-medium">Rs. {order.total.toFixed(2)}</p>
														<p className="text-sm text-muted-foreground">
															{new Date(order.date).toLocaleDateString()}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground text-center py-4">
										No recent orders found
									</p>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
