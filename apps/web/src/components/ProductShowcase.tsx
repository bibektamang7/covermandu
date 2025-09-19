"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/product";
import { useProductsQuery } from "@/hooks/useProducts";

export const ProductShowcase = () => {
	const { data, isError, isLoading } = useProductsQuery();
	if (isLoading) {
		return <>Loading...</>;
	}
	if (!data || isError) {
		return <>EFFOR..</>;
	}
	return (
		<section className="py-20 px-16 bg-gradient-to-b from-background to-secondary/20">
			<div className="  mx-auto px-6">
				<div className="text-center mb-16 space-y-4">
					<h2 className="text-4xl lg:text-5xl font-bold text-balance">
						Our <span className="text-gradient">Premium Collection</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Handpicked cases designed for style, protection, and your lifestyle
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{data.products.slice(0, 4).map((product: Product, index: number) => (
						<Link
							href={`/product/${product.id}`}
							key={product.id}
						>
							<Card
								className="product-card glow-on-hover"
								style={{
									animationDelay: `${index * 0.2}s`,
									animation: "slideInFromBottom 0.8s ease-out forwards",
								}}
							>
								<div className="relative overflow-hidden">
									<img
										src={product.variants[0]?.image}
										alt={product.name}
										className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
									/>

									<div className="absolute top-3 left-3">
										<span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
											{product.tag}
										</span>
									</div>

									<div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<Button
											size="sm"
											variant="secondary"
											className="w-8 h-8 p-0 rounded-full"
										>
											<Heart className="w-4 h-4" />
										</Button>
									</div>
								</div>

								<div className="p-4 space-y-3">
									<div className="space-y-1">
										<h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
											{product.name}
										</h3>

										<div className="flex items-center gap-2">
											<div className="flex items-center">
												<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
												<span className="text-sm font-medium ml-1">
													{product.reviews.length}
												</span>
											</div>
											<span className="text-sm text-muted-foreground">
												({product.reviews.length} reviews)
											</span>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<span className="text-xl font-bold text-primary">
											{product.price - product.price * (product.discount / 100)}
										</span>
										{product.discount !== 0 && (
											<span className="text-sm text-muted-foreground line-through">
												{product.price}
											</span>
										)}
									</div>

									<Button className="w-full group">
										<ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
										Add to Cart
									</Button>
								</div>
							</Card>
						</Link>
					))}
				</div>

				<div className="text-center mt-12">
					<Link href={"/products"}>
						<Button
							variant="outline"
							size="lg"
							className="btn-ghost hover:cursor-pointer"
						>
							View All Cases
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
};
