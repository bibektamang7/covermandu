"use client";
import { useState } from "react";
import EditProductForm from "@/components/EditProductForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProductsQuery } from "@/hooks/useProducts";
import { Pagination } from "@/components/Pagination";

const ProductsManagement = () => {
	const [showEditProduct, setShowEditProduct] = useState(false);
	const [editingProduct, setEditingProduct] = useState<any>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const { data, isLoading } = useProductsQuery({
		page: currentPage,
		limit: 10,
	});

	const totalPages = data?.totalPages || 1;

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-xl">All Products</CardTitle>
						<CardDescription className="py-1">
							View and manage your product inventory
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div>Loading...</div>
					) : (
						<>
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
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</>
					)}
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
