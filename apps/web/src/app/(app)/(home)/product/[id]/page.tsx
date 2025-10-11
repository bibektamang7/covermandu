"use client";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Star,
	Heart,
	ShoppingCart,
	ArrowLeft,
	Truck,
	Shield,
	RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetProduct } from "@/hooks/useProducts";
import { Product, Review, PhoneModel, ProductVariant } from "@/types/product";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import BackButton from "@/components/BackButton";
import { useCart } from "@/context/cartContext";

const getAverageRating = (reviews: Review[]) => {
	if (!reviews || reviews.length === 0) return 0;
	const total = reviews.reduce((acc, review) => acc + review.stars, 0);
	return total / reviews.length;
};

export default function ProductDetail() {
	const params = useParams<{ id: string }>();
	if (!params) {
		return <>Product id required</>;
	}
	const { data, isError, isLoading } = useGetProduct(params.id);

	const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
	const [selectedPhoneModel, setSelectedPhoneModel] =
		useState<PhoneModel | null>(null);
	const [quantity, setQuantity] = useState(1);

	const router = useRouter();
	// Review form state
	const [reviewRating, setReviewRating] = useState(0);
	const [reviewTitle, setReviewTitle] = useState("");
	const [reviewComment, setReviewComment] = useState("");
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);

	const { addToCart } = useCart();

	// Get unique phone models from product variants
	const uniquePhoneModels = Array.from(
		new Set(
			data?.product?.variants.map((v: ProductVariant) => v.phoneModel) || []
		)
	) as PhoneModel[];

	// Filter variants based on selected phone model
	const filteredVariants = selectedPhoneModel
		? data?.product?.variants.filter(
				(v: ProductVariant) => v.phoneModel === selectedPhoneModel
			) || []
		: data?.product?.variants || [];

	// Set default selected variant when phone model changes
	useEffect(() => {
		if (
			filteredVariants.length > 0 &&
			selectedVariantIndex >= filteredVariants.length
		) {
			setSelectedVariantIndex(0);
		} else if (filteredVariants.length > 0 && selectedVariantIndex < 0) {
			setSelectedVariantIndex(0);
		}
	}, [filteredVariants, selectedVariantIndex]);

	// Set default phone model when data is loaded
	useEffect(() => {
		if (data?.product && uniquePhoneModels.length > 0 && !selectedPhoneModel) {
			setSelectedPhoneModel(uniquePhoneModels[0] || null);
		}
	}, [data, uniquePhoneModels, selectedPhoneModel]);

	const handleSubmitReview = async (e: React.FormEvent) => {
		e.preventDefault();

		if (reviewRating === 0) {
			toast("Rating required", {
				description: "Please select a rating for your review.",
			});
			return;
		}

		if (!reviewTitle.trim() || !reviewComment.trim()) {
			toast("Missing information", {
				description: "Please fill in both title and comment for your review.",
			});
			return;
		}

		setIsSubmittingReview(true);

		// Simulate API call
		setTimeout(() => {
			toast("Review submitted", {
				description:
					"Thank you for your feedback. Your review will appear after approval.",
			});

			// Reset form
			setReviewRating(0);
			setReviewTitle("");
			setReviewComment("");
			setIsSubmittingReview(false);
		}, 1000);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<h1 className="text-2xl font-bold text-foreground">Loading...</h1>
			</div>
		);
	}

	if (isError || !data || !data.product) {
		return (
			<div className="min-h-screen bg-background">
				<Navigation />
				<main className="  mx-auto flex-grow flex flex-col justify-center items-center">
					<h1 className="text-2xl font-bold text-foreground mb-4">
						Product Not Found
					</h1>
					<Button
						onClick={() => router.back()}
						variant="outline"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Go Back
					</Button>
				</main>
				<Footer />
			</div>
		);
	}

	const product = data.product as Product;
	const currentVariant = filteredVariants[selectedVariantIndex];

	const averageRating = getAverageRating(product.reviews);
	const reviewCount = product.reviews.length;
	// const originalPrice =
	// 	product.discount > 0
	// 		? product.price / (1 - product.discount / 100)
	// 		: product.price;

	const reviewStats = {
		totalReviews: reviewCount,
		averageRating: averageRating,
		ratingBreakdown: {
			5: product.reviews.filter((r) => r.stars === 5).length,
			4: product.reviews.filter((r) => r.stars === 4).length,
			3: product.reviews.filter((r) => r.stars === 3).length,
			2: product.reviews.filter((r) => r.stars === 2).length,
			1: product.reviews.filter((r) => r.stars === 1).length,
		},
	};

	return (
		<div className="mx-auto px-20 py-16">
			<BackButton />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<div className="space-y-4 h-fit">
					<div className="aspect-square w-full h-96 bg-muted rounded-lg overflow-hidden">
						<Image
							width={40}
							height={40}
							src={currentVariant?.image || "/placeholder.svg"}
							alt={product.name}
							className="w-full h-full object-contain"
						/>
					</div>
					<div className="grid grid-cols-4 gap-2">
						{filteredVariants.map((variant: ProductVariant, index: number) => (
							<button
								key={variant.id}
								onClick={() => setSelectedVariantIndex(index)}
								className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
									selectedVariantIndex === index
										? "border-primary"
										: "border-transparent"
								}`}
							>
								<img
									src={variant.image}
									alt={`${product.name} ${variant.color}`}
									className="w-full h-full object-cover"
								/>
							</button>
						))}
					</div>
				</div>

				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">
							{product.name}
						</h1>
						<div className="flex items-center gap-2 mb-4">
							<div className="flex items-center">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-4 h-4 ${
											i < Math.floor(averageRating)
												? "fill-primary text-primary"
												: "text-muted-foreground"
										}`}
									/>
								))}
							</div>
							<span className="text-sm text-muted-foreground">
								{averageRating.toFixed(1)} ({reviewCount} reviews)
							</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-3xl font-bold text-foreground">
								RS. {product.price - (product.discount / 100) * product.price}
							</span>
							{product.discount > 0 && (
								<>
									<span className="text-lg text-muted-foreground line-through">
										RS. {product.price}
									</span>
									<Badge variant="destructive">{product.discount}% OFF</Badge>
								</>
							)}
						</div>
						<div className="flex items-center gap-3 mt-2">
							{product.category && (
								<Badge variant="outline">
									Category: {product.category.toString().replaceAll("_", " ")}
								</Badge>
							)}
							{product.category && (
								<Badge variant="outline">
									Available Models:{" "}
									{product.availableModel.toString().replaceAll("_", " ")}
								</Badge>
							)}
						</div>
					</div>

					<Separator />

					{uniquePhoneModels.length > 1 && (
						<div>
							<h3 className="font-semibold text-foreground mb-3">
								Phone Model
							</h3>
							<div className="flex gap-2 flex-wrap">
								{uniquePhoneModels.map((model) => (
									<button
										key={model}
										onClick={() => setSelectedPhoneModel(model)}
										className={`px-4 py-2 rounded-md border transition-colors ${
											selectedPhoneModel === model
												? "border-primary bg-primary/10 text-primary"
												: "border-border bg-background text-foreground hover:bg-muted"
										}`}
									>
										{model.toString().replace(/_/g, " ")}
									</button>
								))}
							</div>
						</div>
					)}

					<div>
						<h3 className="font-semibold text-foreground mb-3">Color</h3>
						<div className="flex gap-2 flex-wrap">
							{filteredVariants.map(
								(variant: ProductVariant, index: number) => (
									<button
										key={variant.id}
										onClick={() => setSelectedVariantIndex(index)}
										className={`px-4 py-2 rounded-md border transition-colors ${
											selectedVariantIndex === index
												? "border-primary bg-primary/10 text-primary"
												: "border-border bg-background text-foreground hover:bg-muted"
										}`}
									>
										{variant.color}
									</button>
								)
							)}
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-foreground mb-3">Quantity</h3>
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="icon"
								onClick={() => setQuantity(Math.max(1, quantity - 1))}
							>
								-
							</Button>
							<span className="text-lg font-medium text-foreground w-8 text-center">
								{quantity}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={() => setQuantity(quantity + 1)}
							>
								+
							</Button>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							className="flex-1"
							onClick={() => {
								if (currentVariant) {
									addToCart(product, currentVariant, quantity);
									toast("Added to cart", {
										description: `${product.name} (${currentVariant.color}) has been added to your cart.`,
									});
								}
							}}
						>
							<ShoppingCart className="w-4 h-4 mr-2" />
							Add to Cart
						</Button>
						<Button
							variant="outline"
							size="icon"
						>
							<Heart className="w-4 h-4" />
						</Button>
					</div>

					<div className="grid grid-cols-3 gap-4 py-6">
						<div className="text-center">
							<Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
							<p className="text-xs text-muted-foreground">Home Delivery</p>
						</div>
						<div className="text-center">
							<Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
							<p className="text-xs text-muted-foreground">Guranteed</p>
						</div>
						<div className="text-center">
							<RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
							<p className="text-xs text-muted-foreground">Exchange (T/C)</p>
						</div>
					</div>
				</div>
			</div>

			<div className="lg:mt-8 space-y-8">
				<Card>
					<CardContent className="p-6">
						<h2 className="text-xl font-bold text-foreground mb-4">
							Description
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							{product.description}
						</p>
					</CardContent>
				</Card>

				{product.reviews.length !== 0 ? (
					<div className="mt-12">
						<h2 className="text-2xl font-bold text-foreground mb-6">
							Customer Reviews
						</h2>

						{/* Review Summary */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
							<Card>
								<CardContent className="p-6 text-center">
									<div className="text-4xl font-bold text-foreground mb-2">
										{reviewStats.averageRating.toFixed(1)}
									</div>
									<div className="flex justify-center mb-2">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`w-5 h-5 ${
													i < Math.floor(reviewStats.averageRating)
														? "fill-primary text-primary"
														: "text-muted-foreground"
												}`}
											/>
										))}
									</div>
									<p className="text-muted-foreground">
										Based on {reviewStats.totalReviews} reviews
									</p>
								</CardContent>
							</Card>

							<Card className="lg:col-span-2">
								<CardContent className="p-6">
									<h3 className="font-semibold text-foreground mb-4">
										Rating Breakdown
									</h3>
									<div className="space-y-3">
										{[5, 4, 3, 2, 1].map((rating) => (
											<div
												key={rating}
												className="flex items-center gap-3"
											>
												<span className="text-sm text-foreground w-8">
													{rating} ★
												</span>
												<div className="flex-1 bg-muted rounded-full h-2">
													<div
														className="bg-primary h-2 rounded-full transition-all duration-300"
														style={{
															width: `${
																(reviewStats.ratingBreakdown[
																	rating as keyof typeof reviewStats.ratingBreakdown
																] /
																	(reviewStats.totalReviews || 1)) *
																100
															}%`,
														}}
													/>
												</div>
												<span className="text-sm text-muted-foreground w-12">
													{
														reviewStats.ratingBreakdown[
															rating as keyof typeof reviewStats.ratingBreakdown
														]
													}
												</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Individual Reviews */}
						<div className="space-y-6">
							{product.reviews.map((review) => (
								<Card key={review.id}>
									<CardContent className="p-6">
										<div className="flex items-start gap-4">
											<Avatar className="w-12 h-12">
												<AvatarImage
													src={review.reviewer?.image || ""}
													alt={review.reviewer?.name || "Anonymous"}
												/>
												<AvatarFallback>
													{review.reviewer?.name
														?.split(" ")
														.map((n: string) => n[0])
														.join("") || "A"}
												</AvatarFallback>
											</Avatar>

											<div className="flex-1 space-y-3">
												<div className="flex items-center justify-between">
													<div>
														<div className="flex items-center gap-2">
															<h4 className="font-semibold text-foreground">
																{review.reviewer?.name || "Anonymous"}
															</h4>
														</div>
														<div className="flex items-center gap-2 mt-1">
															<div className="flex">
																{[...Array(5)].map((_, i) => (
																	<Star
																		key={i}
																		className={`w-4 h-4 ${
																			i < review.stars
																				? "fill-primary text-primary"
																				: "text-muted-foreground"
																		}`}
																	/>
																))}
															</div>
															<span className="text-sm text-muted-foreground">
																{new Date(
																	review.createdAt
																).toLocaleDateString()}
															</span>
														</div>
													</div>
												</div>

												<div>
													<p className="text-muted-foreground leading-relaxed">
														{review.message}
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{product.reviews.length > 5 && (
							<div className="text-center mt-8">
								<Button variant="outline">Load More Reviews</Button>
							</div>
						)}
					</div>
				) : (
					<Card>
						<CardContent className="p-12">
							<div className="text-center space-y-6">
								<div className="w-48 h-48 mx-auto mb-6">
									<img
										src={"/no-reviews-illustration.png"}
										alt="No reviews yet"
										className="w-full h-full object-contain opacity-60"
									/>
								</div>
								<div className="space-y-2">
									<h3 className="text-2xl font-semibold text-foreground">
										No Reviews Yet
									</h3>
									<p className="text-muted-foreground max-w-md mx-auto">
										Be the first to share your experience with this product!
										Your review helps other customers make informed decisions.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				<Card className="mb-8">
					<CardContent className="p-6">
						<h3 className="text-xl font-bold text-foreground mb-6">
							Write a Review
						</h3>
						<form
							onSubmit={handleSubmitReview}
							className="space-y-6"
						>
							<div>
								<Label className="text-base font-medium text-foreground mb-3 block">
									Your Rating *
								</Label>
								<div className="flex items-center gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											onClick={() => setReviewRating(star)}
											onMouseEnter={() => setReviewRating(star)}
											className="p-1 hover:scale-110 transition-transform"
										>
											<Star
												className={`w-8 h-8 ${
													star <= reviewRating
														? "fill-primary text-primary"
														: "text-muted-foreground hover:text-primary"
												}`}
											/>
										</button>
									))}
									{reviewRating > 0 && (
										<span className="ml-2 text-sm text-muted-foreground">
											{reviewRating} out of 5 stars
										</span>
									)}
								</div>
							</div>
							<div>
								<Label
									htmlFor="review-comment"
									className="text-base font-medium text-foreground"
								>
									Your Review *
								</Label>
								<Textarea
									id="review-comment"
									value={reviewComment}
									onChange={(e) => setReviewComment(e.target.value)}
									placeholder="Tell others about your experience with this product. What did you like or dislike?"
									className="mt-2 min-h-[120px]"
									maxLength={1000}
								/>
								<p className="text-xs text-muted-foreground mt-1">
									{reviewComment.length}/1000 characters
								</p>
							</div>

							<Button
								type="submit"
								disabled={isSubmittingReview}
								className="w-full sm:w-auto"
							>
								{isSubmittingReview ? "Submitting..." : "Submit Review"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
