"use client";
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Heart, ShoppingCart, Star, Filter, Sparkles } from "lucide-react";
import Link from "next/link";

const allProducts = [
	{
		id: 1,
		name: "Crystal Clear Pro",
		price: 1299,
		originalPrice: 1599,
		rating: 4.8,
		reviews: 124,
		image: "",
		colors: ["transparent", "smoke", "blue"],
		category: "trending",
		tag: "Best Seller",
		isNew: false,
		likes: 89,
	},
	{
		id: 2,
		name: "Urban Shield",
		price: 999,
		originalPrice: 1299,
		rating: 4.9,
		reviews: 89,
		image: "",
		colors: ["black", "navy", "forest"],
		category: "new",
		tag: "New",
		isNew: true,
		likes: 156,
	},
	{
		id: 3,
		name: "Gradient Glow",
		price: 1499,
		originalPrice: 1799,
		rating: 4.7,
		reviews: 156,
		image: "",
		colors: ["sunset", "ocean", "aurora"],
		category: "trending",
		tag: "Limited",
		isNew: false,
		likes: 203,
	},
	{
		id: 4,
		name: "Minimalist Matte",
		price: 899,
		originalPrice: 1199,
		rating: 4.6,
		reviews: 78,
		image: "",
		colors: ["white", "sand", "stone"],
		category: "popular",
		tag: "Popular",
		isNew: false,
		likes: 134,
	},
	{
		id: 5,
		name: "Premium Leather",
		price: 1999,
		originalPrice: 2399,
		rating: 4.9,
		reviews: 67,
		image: "",
		colors: ["brown", "black", "tan"],
		category: "premium",
		tag: "Premium",
		isNew: false,
		likes: 178,
	},
	{
		id: 6,
		name: "Neon Burst",
		price: 1199,
		originalPrice: 1499,
		rating: 4.5,
		reviews: 92,
		image: "",
		colors: ["neon-pink", "neon-green", "neon-yellow"],
		category: "new",
		tag: "New",
		isNew: true,
		likes: 87,
	},
];

const filterOptions = [
	{ value: "all", label: "All Products" },
	{ value: "trending", label: "Trending" },
	{ value: "new", label: "New Arrivals" },
	{ value: "popular", label: "Most Popular" },
	{ value: "most-liked", label: "Most Liked" },
	{ value: "premium", label: "Premium" },
];

const sortOptions = [
	{ value: "newest", label: "Newest First" },
	{ value: "price-low", label: "Price: Low to High" },
	{ value: "price-high", label: "Price: High to Low" },
	{ value: "rating", label: "Highest Rated" },
	{ value: "most-liked", label: "Most Liked" },
];

const Products = () => {
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [selectedSort, setSelectedSort] = useState("newest");

	const getColorStyle = (color: string) => {
		const colorMap: { [key: string]: string } = {
			transparent: "rgba(255,255,255,0.3)",
			smoke: "#6B7280",
			blue: "#3B82F6",
			black: "#1F2937",
			navy: "#1E3A8A",
			forest: "#166534",
			sunset: "#F59E0B",
			ocean: "#0EA5E9",
			aurora: "#8B5CF6",
			white: "#F9FAFB",
			sand: "#F3E8C6",
			stone: "#A8A29E",
			brown: "#8B4513",
			tan: "#D2B48C",
			"neon-pink": "#FF1493",
			"neon-green": "#00FF00",
			"neon-yellow": "#FFFF00",
		};
		return colorMap[color] || color;
	};

	const filteredProducts = allProducts
		.filter((product) => {
			// Filter by category
			if (selectedFilter === "all") return true;
			if (selectedFilter === "most-liked") {
				return product.likes > 150;
			}
			return product.category === selectedFilter;
		})
		.sort((a, b) => {
			switch (selectedSort) {
				case "price-low":
					return a.price - b.price;
				case "price-high":
					return b.price - a.price;
				case "rating":
					return b.rating - a.rating;
				case "most-liked":
					return b.likes - a.likes;
				default:
					return b.id - a.id; // newest first
			}
		});

	return (
		<div className="min-h-screen">
			<Navigation />
			<main className="pt-20 px-12">
				<section className="py-8 bg-background/80 backdrop-blur-sm z-40 border-b">
					<div className="container mx-auto px-6">
						<div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
							<div className="flex flex-wrap gap-2">
								{filterOptions.map((option) => (
									<Button
										key={option.value}
										variant={
											selectedFilter === option.value ? "default" : "outline"
										}
										size="sm"
										onClick={() => setSelectedFilter(option.value)}
										className="transition-all duration-200 hover-scale"
									>
										{option.label}
									</Button>
								))}
							</div>

							<div className="flex items-center gap-3">
								<span className="text-sm text-muted-foreground font-medium">
									Sort by:
								</span>
								<Select
									value={selectedSort}
									onValueChange={setSelectedSort}
								>
									<SelectTrigger className="w-48 border-0 bg-muted/50">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{sortOptions.map((option) => (
											<SelectItem
												key={option.value}
												value={option.value}
											>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{selectedFilter !== "all" && (
							<div className="mt-4 animate-fade-in">
								<Badge
									variant="secondary"
									className="flex items-center gap-1 w-fit"
								>
									<Filter className="w-3 h-3" />
									{filterOptions.find((f) => f.value === selectedFilter)?.label}
									<button
										onClick={() => setSelectedFilter("all")}
										className="ml-1 hover:text-destructive transition-colors"
									>
										×
									</button>
								</Badge>
							</div>
						)}
					</div>
				</section>

				<section className="py-20 bg-gradient-to-b from-background to-secondary/5">
					<div className="container mx-auto px-6">
						<div className="mb-12 text-center">
							<h2 className="text-3xl font-bold mb-4 animate-fade-in">
								{selectedFilter === "all"
									? `${filteredProducts.length} Premium Products`
									: `${filteredProducts.length} ${filterOptions.find((f) => f.value === selectedFilter)?.label} Products`}
							</h2>
							<div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto animate-scale-in"></div>
						</div>

						{filteredProducts.length === 0 ? (
							<div className="text-center py-20 animate-fade-in">
								<div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
									<Filter className="w-8 h-8 text-muted-foreground" />
								</div>
								<h3 className="text-xl font-semibold mb-2">
									No products found
								</h3>
								<p className="text-muted-foreground text-lg mb-6">
									Try adjusting your filters to see more results
								</p>
								<Button
									onClick={() => setSelectedFilter("all")}
									variant="outline"
								>
									View All Products
								</Button>
							</div>
						) : (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
								{filteredProducts.map((product, index) => (
									<div
										key={product.id}
										className="animate-fade-in hover-scale"
										style={{ animationDelay: `${index * 0.1}s` }}
									>
										<Link
											href={`/product/${product.id}`}
											className="block"
										>
											<Card className="product-card group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-secondary/10">
												{/* Product Image */}
												<div className="relative overflow-hidden rounded-t-xl">
													<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
													<img
														src={product.image}
														alt={product.name}
														className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
													/>

													{/* Floating Tag */}
													<div className="absolute top-4 left-4 z-20">
														<Badge className="bg-white/90 text-primary border-0 shadow-lg backdrop-blur-sm font-semibold">
															{product.tag}
														</Badge>
													</div>

													{/* Quick Actions */}
													<div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95">
														<Button
															size="sm"
															variant="secondary"
															className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white"
														>
															<Heart className="w-4 h-4 text-primary" />
														</Button>
													</div>

													{/* Color Palette */}
													<div className="absolute bottom-4 left-4 z-20 flex gap-1.5">
														{product.colors.map((color, i) => (
															<div
																key={i}
																className="w-5 h-5 rounded-full border-2 border-white/80 shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
																style={{
																	backgroundColor: getColorStyle(color),
																}}
															/>
														))}
													</div>

													{/* Likes Counter */}
													<div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm text-primary text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg font-medium">
														<Heart className="w-3 h-3 fill-red-500 text-red-500" />
														{product.likes}
													</div>
												</div>

												{/* Product Info */}
												<div className="p-6 space-y-4">
													<div className="space-y-2">
														<h3 className="font-bold text-xl group-hover:text-primary transition-colors duration-300">
															{product.name}
														</h3>

														{/* Rating */}
														<div className="flex items-center gap-3">
															<div className="flex items-center gap-1">
																<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
																<span className="text-sm font-semibold">
																	{product.rating}
																</span>
															</div>
															<span className="text-sm text-muted-foreground">
																{product.reviews} reviews
															</span>
														</div>
													</div>

													{/* Price */}
													<div className="flex items-center gap-3">
														<span className="text-2xl font-bold text-primary">
															₹{product.price}
														</span>
														<span className="text-sm text-muted-foreground line-through bg-muted/50 px-2 py-1 rounded-md">
															₹{product.originalPrice}
														</span>
													</div>

													{/* Add to Cart */}
													<Button
														className="w-full group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transition-all duration-300"
														size="lg"
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															// Add to cart logic here
														}}
													>
														<ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
														Add to Cart
													</Button>
												</div>
											</Card>
										</Link>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default Products;
