"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { useSession } from "next-auth/react";
import { useGetRecommendedProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";

const RecommendedProducts = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { data, isLoading, error } = useGetRecommendedProducts(
		session?.user?.token!
	);
	if (isLoading) {
		return (
			<section className="py-16 bg-muted/50">
				<div className="mx-auto px-6">
					<h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
					<p className="text-center">Loading recommended products...</p>
				</div>
			</section>
		);
	}
	const handleError = () => {
		window.location.reload();
	};

	if (error) {
		return (
			<section className="py-16 bg-muted/50">
				<div className="mx-auto px-6">
					<h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
					<p className="text-center text-red-500">Error: {error.message}</p>
					<Button
						onClick={handleError}
						className="text-center hover:cursor-pointer"
					>
						Reload the page
					</Button>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 bg-muted/50">
			<div className="mx-auto px-6">
				<h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{data.products.length > 0 ? (
						data.products.map((product: Product) => {
							const productImage =
								product.variants[0]?.image || "/placeholder-image.jpg";
							const finalPrice = product.discount
								? product.price - (product.price * product.discount) / 100
								: product.price;

							return (
								<Card
									key={product.id}
									className="group hover:shadow-md transition-all duration-300"
								>
									<CardContent className="p-4">
										<div className="aspect-square overflow-hidden rounded-lg mb-4">
											<img
												src={productImage}
												alt={product.name}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												onError={(e) => {
													const target = e.target as HTMLImageElement;
													target.src = "/placeholder-image.jpg";
												}}
											/>
										</div>
										<h3 className="font-semibold mb-2 text-sm">
											{product.name}
										</h3>
										<div className="flex items-center gap-2 mb-3">
											{product.discount > 0 && (
												<span className="text-muted-foreground line-through text-sm">
													Rs. {product.price.toLocaleString()}
												</span>
											)}
											<span className="text-primary font-bold">
												Rs. {finalPrice.toLocaleString()}
											</span>
										</div>
										<Button
											size="sm"
											variant="outline"
											className="w-full"
										>
											Add to Cart
										</Button>
									</CardContent>
								</Card>
							);
						})
					) : (
						<div className="col-span-full text-center py-8">
							<p>No recommended products available at the moment.</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default RecommendedProducts;
