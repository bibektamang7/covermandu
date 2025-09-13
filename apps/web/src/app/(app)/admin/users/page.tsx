import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, Trash2, UserPlus } from "lucide-react";

const UsersManagement = () => {
	// Mock user data
	const users = [
		{
			id: 1,
			name: "John Doe",
			email: "john@example.com",
			role: "Customer",
			status: "Active",
			joinDate: "2024-01-15",
			avatar: "/placeholder.svg",
		},
		{
			id: 2,
			name: "Jane Smith",
			email: "jane@example.com",
			role: "Admin",
			status: "Active",
			joinDate: "2024-02-20",
			avatar: "/placeholder.svg",
		},
		{
			id: 3,
			name: "Mike Johnson",
			email: "mike@example.com",
			role: "Customer",
			status: "Inactive",
			joinDate: "2024-03-10",
			avatar: "/placeholder.svg",
		},
		{
			id: 4,
			name: "Sarah Wilson",
			email: "sarah@example.com",
			role: "Customer",
			status: "Active",
			joinDate: "2024-03-25",
			avatar: "/placeholder.svg",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "active":
				return "bg-green-100 text-green-800";
			case "inactive":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getRoleColor = (role: string) => {
		switch (role.toLowerCase()) {
			case "admin":
				return "bg-blue-100 text-blue-800";
			case "customer":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>All Users</CardTitle>
						<CardDescription>View and manage user accounts</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Join Date</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={user.avatar}
													alt={user.name}
												/>
												<AvatarFallback>
													{user.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<span className="font-medium">{user.name}</span>
										</div>
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge
											className={getRoleColor(user.role)}
											variant="secondary"
										>
											{user.role}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge
											className={getStatusColor(user.status)}
											variant="secondary"
										>
											{user.status}
										</Badge>
									</TableCell>
									<TableCell>{user.joinDate}</TableCell>
									<TableCell className="text-right">
										<div className="flex gap-2 justify-end">
											<Button
												variant="ghost"
												size="sm"
											>
												<Eye className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
											>
												<Edit className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};

export default UsersManagement;
