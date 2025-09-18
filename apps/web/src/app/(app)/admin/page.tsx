"use client";
import { useState } from "react";
import EditProductForm from "@/components/EditProductForm";
import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";

const ProductsManagement = () => {
	const [showAddProduct, setShowAddProduct] = useState(false);
	const [showEditProduct, setShowEditProduct] = useState(false);
	const [editingProduct, setEditingProduct] = useState<any>(null);

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "active":
				return "bg-green-100 text-green-800";
			case "out of stock":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>All Products</CardTitle>
						<CardDescription>
							View and manage your product inventory
						</CardDescription>
					</div>
					<Button onClick={() => setShowAddProduct(true)}>
						<Plus className="w-4 h-4 mr-2" />
						Add Product
					</Button>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Product</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Price</TableHead>
								<TableHead>Stock</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						{/* <TableBody>
							{products.map((product) => (
								<TableRow key={product.id}>
									<TableCell className="font-medium">{product.name}</TableCell>
									<TableCell>{product.category}</TableCell>
									<TableCell className="text-primary font-semibold">
										{product.price}
									</TableCell>
									<TableCell>{product.stock}</TableCell>
									<TableCell>
										<Badge
											className={getStatusColor(product.status)}
											variant="secondary"
										>
											{product.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex gap-2 justify-end">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleEditProduct(product)}
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
						</TableBody> */}
					</Table>
				</CardContent>
			</Card>

			<EditProductForm
				open={showEditProduct}
				onOpenChange={setShowEditProduct}
				product={editingProduct}
			/>
		</div>
	);
};

export default ProductsManagement;
