"use client";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Heart, ShoppingCart, Star, Filter } from "lucide-react";
import Link from "next/link";
import { useProductsQuery } from "@/hooks/useProducts";
import { Product, Tag, Review } from "@/types/product";
import BackButton from "@/components/BackButton";
import { useCart } from "@/context/cartContext";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ReviewForm from "@/components/ReviewForm";
import { categories, phoneModels } from "@/lib/constants";
import { Pagination } from "@/components/Pagination";
import { filterOptions, sortOptions } from "@/lib/constants";
import { getAverageRating } from "@/lib/utils";

const Products = () => {
	const [selectedFilter, setSelectedFilter] = useState<string>("all");
	const [selectedSort, setSelectedSort] = useState("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const [openReviewDialog, setOpenReviewDialog] = useState(false);
	const [selectedProductForReview, setSelectedProductForReview] =
		useState<Product | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
		undefined
	);
	const [selectedModel, setSelectedModel] = useState<string | undefined>(
		undefined
	);
	const productsPerPage = 12;
	const { addToCart } = useCart();

	const { data, isLoading, refetch } = useProductsQuery({
		category: selectedCategory,
		phoneModel: selectedModel,
		sortBy:
			selectedSort === "price-low" || selectedSort === "price-high"
				? "price"
				: selectedSort === "rating"
					? "reviews"
					: "createdAt",
		order: selectedSort === "price-low" ? "asc" : "desc",
	});

	useEffect(() => {
		setCurrentPage(1);
	}, [selectedFilter, selectedSort, selectedCategory, selectedModel]);

	const filteredProducts =
		data?.products.filter((product: Product) => {
			if (selectedFilter === "all") return true;
			const tagKey = product.tag as unknown as keyof typeof Tag;
			return tagKey === selectedFilter;
		}) || [];

	// Reset to first page if current page exceeds total pages
	const totalPages = Math.ceil(
		(filteredProducts?.length || 0) / productsPerPage
	);

	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(1);
		}
	}, [currentPage, totalPages]);

	useEffect(() => {
		setCurrentPage(1);
	}, [selectedFilter, selectedSort, selectedCategory, selectedModel]);

	const paginatedProducts =
		filteredProducts?.slice(
			(currentPage - 1) * productsPerPage,
			currentPage * productsPerPage
		) || [];

	const handleReviewSubmitted = () => {
		setOpenReviewDialog(false);
		// Refetch products to update reviews
		refetch();
	};

	const clearFilters = () => {
		setSelectedFilter("all");
		setSelectedCategory(undefined);
		setSelectedModel(undefined);
	};

	if (isLoading) {
		return <>Loading...</>;
	}

	return (
		<section className="pt-20 px-16">
			<BackButton />
			<section className="py-8 bg-background/80 backdrop-blur-sm z-40 border-b">
				<div className="mx-auto px-6">
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
								<SelectContent className="bg-red-400">
									<SelectGroup>
										{sortOptions.map((option) => (
											<SelectItem
												key={option.value}
												value={option.value}
												className="pr-0! mr-0!"
											>
												{option.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>

					{(selectedFilter !== "all" || selectedCategory || selectedModel) && (
						<div className="mt-4 animate-fade-in">
							<div className="flex flex-wrap gap-2">
								{selectedFilter !== "all" && (
									<Badge
										variant="secondary"
										className="flex items-center gap-1 w-fit"
									>
										<Filter className="w-3 h-3" />
										{
											filterOptions.find((f) => f.value === selectedFilter)
												?.label
										}
										<button
											onClick={() => setSelectedFilter("all")}
											className="ml-1 hover:text-destructive transition-colors"
										>
											×
										</button>
									</Badge>
								)}
								{selectedCategory && (
									<Badge
										variant="secondary"
										className="flex items-center gap-1 w-fit"
									>
										<Filter className="w-3 h-3" />
										Category: {selectedCategory.replaceAll("_", " ")}
										<button
											onClick={() => setSelectedCategory(undefined)}
											className="ml-1 hover:text-destructive transition-colors"
										>
											×
										</button>
									</Badge>
								)}
								{selectedModel && (
									<Badge
										variant="secondary"
										className="flex items-center gap-1 w-fit"
									>
										<Filter className="w-3 h-3" />
										Model: {selectedModel.replaceAll("_", " ")}
										<button
											onClick={() => setSelectedModel(undefined)}
											className="ml-1 hover:text-destructive transition-colors"
										>
											×
										</button>
									</Badge>
								)}
							</div>
							<Button
								onClick={clearFilters}
								variant="outline"
								size="sm"
								className="mt-2"
							>
								Clear All Filters
							</Button>
						</div>
					)}
				</div>
			</section>

			<section className="pb-20 bg-gradient-to-b from-background to-secondary/5">
				<div className="mx-auto px-6">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Filter Section */}
						<div className="w-full lg:w-1/4">
							<Card className="p-6 sticky top-24">
								<h3 className="text-lg font-semibold mb-4">Filters</h3>

								{/* Category Filter */}
								<div className="mb-6">
									<h4 className="font-medium mb-3">Category</h4>
									<div className="space-y-2">
										{categories.map((category) => (
											<div
												key={category}
												className="flex items-center"
											>
												<input
													type="radio"
													id={`category-${category}`}
													name="category"
													checked={selectedCategory === category}
													onChange={() => setSelectedCategory(category)}
													className="mr-2"
												/>
												<label
													htmlFor={`category-${category}`}
													className="text-sm cursor-pointer"
												>
													{category.replaceAll("_", " ").toLowerCase()}
												</label>
											</div>
										))}
										<input
											type="radio"
											id="category-all"
											name="category"
											checked={selectedCategory === undefined}
											onChange={() => setSelectedCategory(undefined)}
											className="mr-2"
										/>
										<label
											htmlFor="category-all"
											className="text-sm cursor-pointer"
										>
											All Categories
										</label>
									</div>
								</div>

								{/* Model Filter */}
								<div>
									<h4 className="font-medium mb-3">Phone Model</h4>
									<div className="space-y-2">
										{phoneModels.map((model) => (
											<div
												key={model}
												className="flex items-center"
											>
												<input
													type="radio"
													id={`model-${model}`}
													name="model"
													checked={selectedModel === model}
													onChange={() => setSelectedModel(model)}
													className="mr-2"
												/>
												<label
													htmlFor={`model-${model}`}
													className="text-sm cursor-pointer"
												>
													{model.replaceAll("_", " ").toLocaleLowerCase()}
												</label>
											</div>
										))}
										<input
											type="radio"
											id="model-all"
											name="model"
											checked={selectedModel === undefined}
											onChange={() => setSelectedModel(undefined)}
											className="mr-2"
										/>
										<label
											htmlFor="model-all"
											className="text-sm cursor-pointer"
										>
											All Models
										</label>
									</div>
								</div>
							</Card>
						</div>

						{/* Products Section */}
						<div className="w-full lg:w-3/4">
							{filteredProducts && filteredProducts.length === 0 ? (
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
										onClick={clearFilters}
										variant="outline"
									>
										Clear All Filters
									</Button>
								</div>
							) : (
								<>
									<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
										{paginatedProducts.map(
											(product: Product, index: number) => {
												const averageRating = getAverageRating(product.reviews);
												const originalPrice =
													product.discount > 0
														? Math.round(
																product.price / (1 - product.discount / 100)
															)
														: product.price;
												return (
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
																		src={
																			product.variants[0]?.image ||
																			"/placeholder.svg"
																		}
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
																</div>

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
																					{averageRating.toFixed(1)}
																				</span>
																			</div>
																			<span className="text-sm text-muted-foreground">
																				{product.reviews.length} reviews
																			</span>
																		</div>
																	</div>

																	{/* Price */}
																	<div className="flex items-center gap-3">
																		<span className="text-2xl font-bold text-primary">
																			RS. {product.price}
																		</span>
																		{product.discount > 0 && (
																			<span className="text-sm text-muted-foreground line-through bg-muted/50 px-2 py-1 rounded-md">
																				RS. {originalPrice}
																			</span>
																		)}
																	</div>

																	<div className="flex gap-2">
																		<Button
																			className="flex-1 group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transition-all duration-300"
																			size="lg"
																			onClick={(e) => {
																				e.preventDefault();
																				e.stopPropagation();
																				addToCart(
																					product,
																					product.variants[0]!,
																					1
																				);
																				toast("Added to cart", {
																					description: `${product.name} has been added to your cart.`,
																				});
																			}}
																		>
																			<ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
																			Add to Cart
																		</Button>
																		<Dialog
																			open={
																				openReviewDialog &&
																				selectedProductForReview?.id ===
																					product.id
																			}
																			onOpenChange={(open) => {
																				setOpenReviewDialog(open);
																				if (open) {
																					setSelectedProductForReview(product);
																				} else {
																					setSelectedProductForReview(null);
																				}
																			}}
																		>
																			<DialogTrigger asChild>
																				<Button
																					variant="outline"
																					size="lg"
																					onClick={(e) => {
																						e.preventDefault();
																						e.stopPropagation();
																						setSelectedProductForReview(
																							product
																						);
																						setOpenReviewDialog(true);
																					}}
																				>
																					Review
																				</Button>
																			</DialogTrigger>
																			<DialogContent className="sm:max-w-[425px]">
																				<DialogHeader>
																					<DialogTitle>
																						Write a Review
																					</DialogTitle>
																				</DialogHeader>
																				{selectedProductForReview && (
																					<ReviewForm
																						productId={
																							selectedProductForReview.id
																						}
																						onReviewSubmitted={
																							handleReviewSubmitted
																						}
																					/>
																				)}
																			</DialogContent>
																		</Dialog>
																	</div>
																</div>
															</Card>
														</Link>
													</div>
												);
											}
										)}
									</div>
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={setCurrentPage}
									/>
								</>
							)}
						</div>
					</div>
				</div>
			</section>
		</section>
	);
};

export default Products;
