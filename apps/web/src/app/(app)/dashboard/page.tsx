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
import NavigationLayout from "@/components/NavigationLayout";

const Dashboard = () => {
	const userStats = [
		{
			title: "Total Orders",
			value: "12",
			icon: ShoppingBag,
			color: "text-blue-600",
		},
		{
			title: "Active Orders",
			value: "3",
			icon: Package,
			color: "text-orange-600",
		},
		{ title: "Wishlist Items", value: "8", icon: Heart, color: "text-red-600" },
		{
			title: "Total Reviews",
			value: "2,450",
			icon: Star,
			color: "text-yellow-600",
		},
	];

	const recentOrders = [
		{
			id: "#ORD-2024-001",
			date: "Jan 15, 2024",
			status: "Delivered",
			total: "Rs. 3,999",
			items: "iPhone 15 Pro Case + Screen Protector",
		},
		{
			id: "#ORD-2024-002",
			date: "Jan 10, 2024",
			status: "Shipped",
			total: "Rs. 1,299",
			items: "Wireless Charger",
		},
		{
			id: "#ORD-2024-003",
			date: "Jan 5, 2024",
			status: "Processing",
			total: "Rs. 2,199",
			items: "Phone Stand + Cable Organizer",
		},
	];

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

	return (
		<div className="min-h-screen bg-muted/30">
			<NavigationLayout />
			<main className="pt-20 px-16">
				<div className="container mx-auto px-6 py-8">
					{/* Header */}
					<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
						<div>
							<h1 className="text-3xl font-bold mb-2">Dashboard</h1>
							<p className="text-muted-foreground">Welcome back, Rajesh!</p>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
						{/* User Profile Card */}
						<Card className="lg:row-span-2">
							<CardHeader className="text-center">
								<Avatar className="w-20 h-20 mx-auto mb-4">
									<AvatarImage
										src=""
										alt="User"
									/>
									<AvatarFallback>RS</AvatarFallback>
								</Avatar>
								<CardTitle>Rajesh Sharma</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-3 text-sm">
									<Mail className="w-4 h-4 text-muted-foreground" />
									<span>rajesh@example.com</span>
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
									<span>Member since 2023</span>
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

						{/* Quick Actions */}
						<Card className="lg:col-span-3">
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
								<CardDescription>
									Manage your account and orders
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
									<Button
										variant="outline"
										className="h-auto p-4 flex flex-col items-center gap-2"
									>
										<Package className="w-6 h-6" />
										<span>Track Orders</span>
									</Button>
									<Button
										variant="outline"
										className="h-auto p-4 flex flex-col items-center gap-2"
									>
										<Heart className="w-6 h-6" />
										<span>Wishlist</span>
									</Button>
									<Button
										variant="outline"
										className="h-auto p-4 flex flex-col items-center gap-2"
									>
										<MapPin className="w-6 h-6" />
										<span>Addresses</span>
									</Button>
									<Button
										variant="outline"
										className="h-auto p-4 flex flex-col items-center gap-2"
									>
										<Star className="w-6 h-6" />
										<span>Reviews</span>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
