"use client";
import { useState } from "react";
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
	ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NavigationLayout from "@/components/NavigationLayout";

// Mock product data - in a real app this would come from an API
const productData = {
	"1": {
		id: "1",
		name: "Classic Clear Case",
		price: 29.99,
		originalPrice: 39.99,
		rating: 4.5,
		reviewCount: 1247,
		images: [
			"/placeholder.svg",
			"/placeholder.svg",
			"/placeholder.svg",
			"/placeholder.svg",
		],
		colors: ["Clear", "Black", "Blue", "Pink"],
		features: [
			"Drop protection up to 10ft",
			"Wireless charging compatible",
			"Anti-yellowing technology",
			"Precise cutouts for all ports",
		],
		description:
			"Our Classic Clear Case offers the perfect balance of protection and style. Made from premium materials with advanced anti-yellowing technology, this case keeps your phone safe while showcasing its original design.",
		specifications: {
			Material: "TPU + PC",
			Weight: "45g",
			Thickness: "1.2mm",
			Compatibility: "iPhone 15 Pro Max",
		},
		reviews: [
			{
				id: 1,
				name: "Sarah Johnson",
				avatar: "/placeholder.svg",
				rating: 5,
				date: "2024-01-15",
				title: "Perfect protection and style!",
				comment:
					"This case has been amazing! Dropped my phone multiple times and it's still in perfect condition. The clear design shows off my phone beautifully.",
				helpful: 24,
				verified: true,
			},
			{
				id: 2,
				name: "Mike Chen",
				avatar: "/placeholder.svg",
				rating: 4,
				date: "2024-01-10",
				title: "Great quality, minor yellowing after 6 months",
				comment:
					"Overall excellent case. Good protection and fits perfectly. Started to yellow slightly after 6 months of use, but still looks decent.",
				helpful: 18,
				verified: true,
			},
			{
				id: 3,
				name: "Emma Rodriguez",
				avatar: "/placeholder.svg",
				rating: 5,
				date: "2024-01-08",
				title: "Wireless charging works perfectly",
				comment:
					"No issues with wireless charging at all. Case feels premium and the buttons are very responsive. Highly recommend!",
				helpful: 31,
				verified: true,
			},
			{
				id: 4,
				name: "David Wilson",
				avatar: "/placeholder.svg",
				rating: 4,
				date: "2024-01-05",
				title: "Good value for money",
				comment:
					"Solid case for the price. Protection seems good and I like the minimalist design. Easy to clean too.",
				helpful: 12,
				verified: false,
			},
			{
				id: 5,
				name: "Lisa Park",
				avatar: "/placeholder.svg",
				rating: 5,
				date: "2024-01-02",
				title: "Exceeded expectations!",
				comment:
					"This case is exactly what I was looking for. Clear, protective, and doesn't add too much bulk. The corners feel very secure.",
				helpful: 27,
				verified: true,
			},
		],
		reviewStats: {
			totalReviews: 1247,
			averageRating: 4.5,
			ratingBreakdown: {
				5: 847,
				4: 278,
				3: 89,
				2: 21,
				1: 12,
			},
		},
	},
};

export default function ProductDetail({ params }: { params: { id: string } }) {
	const { id } = params;
	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState(0);
	const [quantity, setQuantity] = useState(1);

	const router = useRouter();
	const product = productData[id as keyof typeof productData];

	if (!product) {
		return (
			<div className="min-h-screen bg-background">
				<NavigationLayout />
				<main className="container mx-auto px-4 py-16 text-center">
					<h1 className="text-2xl font-bold text-foreground mb-4">
						Product Not Found
					</h1>
					<Button onClick={() => router.back()}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Go Back
					</Button>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<NavigationLayout />

			<main className="container mx-auto px-4 py-8">
				<Button
					variant="ghost"
					onClick={() => router.back()}
					className="mb-6"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back
				</Button>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Product Images */}
					<div className="space-y-4">
						<div className="aspect-square bg-muted rounded-lg overflow-hidden">
							<img
								src={product.images[selectedImage]}
								alt={product.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="grid grid-cols-4 gap-2">
							{product.images.map((image, index) => (
								<button
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
										selectedImage === index
											? "border-primary"
											: "border-transparent"
									}`}
								>
									<img
										src={image}
										alt={`${product.name} view ${index + 1}`}
										className="w-full h-full object-cover"
									/>
								</button>
							))}
						</div>
					</div>

					{/* Product Info */}
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
											className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
										/>
									))}
								</div>
								<span className="text-sm text-muted-foreground">
									{product.rating} ({product.reviewCount} reviews)
								</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-3xl font-bold text-foreground">
									${product.price}
								</span>
								<span className="text-lg text-muted-foreground line-through">
									${product.originalPrice}
								</span>
								<Badge variant="destructive">25% OFF</Badge>
							</div>
						</div>

						<Separator />

						<div>
							<h3 className="font-semibold text-foreground mb-3">Color</h3>
							<div className="flex gap-2">
								{product.colors.map((color, index) => (
									<button
										key={color}
										onClick={() => setSelectedColor(index)}
										className={`px-4 py-2 rounded-md border transition-colors ${
											selectedColor === index
												? "border-primary bg-primary/10 text-primary"
												: "border-border bg-background text-foreground hover:bg-muted"
										}`}
									>
										{color}
									</button>
								))}
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
							<Button className="flex-1">
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
								<p className="text-xs text-muted-foreground">Free Shipping</p>
							</div>
							<div className="text-center">
								<Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
								<p className="text-xs text-muted-foreground">2 Year Warranty</p>
							</div>
							<div className="text-center">
								<RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
								<p className="text-xs text-muted-foreground">30 Day Returns</p>
							</div>
						</div>
					</div>
				</div>

				{/* Product Details */}
				<div className="mt-16 space-y-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<Card>
							<CardContent className="p-6">
								<h2 className="text-xl font-bold text-foreground mb-4">
									Description
								</h2>
								<p className="text-muted-foreground leading-relaxed">
									{product.description}
								</p>
								<h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
									Key Features
								</h3>
								<ul className="space-y-2">
									{product.features.map((feature, index) => (
										<li
											key={index}
											className="flex items-start gap-2 text-muted-foreground"
										>
											<span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
											{feature}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<h2 className="text-xl font-bold text-foreground mb-4">
									Specifications
								</h2>
								<div className="space-y-3">
									{Object.entries(product.specifications).map(
										([key, value]) => (
											<div
												key={key}
												className="flex justify-between py-2 border-b border-border last:border-0"
											>
												<span className="font-medium text-foreground">
													{key}
												</span>
												<span className="text-muted-foreground">{value}</span>
											</div>
										)
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Reviews Section */}
					<div className="mt-12">
						<h2 className="text-2xl font-bold text-foreground mb-6">
							Customer Reviews
						</h2>

						{/* Review Summary */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
							<Card>
								<CardContent className="p-6 text-center">
									<div className="text-4xl font-bold text-foreground mb-2">
										{product.reviewStats.averageRating}
									</div>
									<div className="flex justify-center mb-2">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`w-5 h-5 ${i < Math.floor(product.reviewStats.averageRating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
											/>
										))}
									</div>
									<p className="text-muted-foreground">
										Based on {product.reviewStats.totalReviews} reviews
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
															width: `${(product.reviewStats.ratingBreakdown[rating as keyof typeof product.reviewStats.ratingBreakdown] / product.reviewStats.totalReviews) * 100}%`,
														}}
													/>
												</div>
												<span className="text-sm text-muted-foreground w-12">
													{
														product.reviewStats.ratingBreakdown[
															rating as keyof typeof product.reviewStats.ratingBreakdown
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
													src={review.avatar}
													alt={review.name}
												/>
												<AvatarFallback>
													{review.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>

											<div className="flex-1 space-y-3">
												<div className="flex items-center justify-between">
													<div>
														<div className="flex items-center gap-2">
															<h4 className="font-semibold text-foreground">
																{review.name}
															</h4>
															{review.verified && (
																<Badge
																	variant="secondary"
																	className="text-xs"
																>
																	Verified Purchase
																</Badge>
															)}
														</div>
														<div className="flex items-center gap-2 mt-1">
															<div className="flex">
																{[...Array(5)].map((_, i) => (
																	<Star
																		key={i}
																		className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
																	/>
																))}
															</div>
															<span className="text-sm text-muted-foreground">
																{new Date(review.date).toLocaleDateString()}
															</span>
														</div>
													</div>
												</div>

												<div>
													<h5 className="font-medium text-foreground mb-2">
														{review.title}
													</h5>
													<p className="text-muted-foreground leading-relaxed">
														{review.comment}
													</p>
												</div>

												<div className="flex items-center gap-4">
													<Button
														variant="ghost"
														size="sm"
														className="text-muted-foreground"
													>
														<ThumbsUp className="w-4 h-4 mr-1" />
														Helpful ({review.helpful})
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{/* Load More Reviews */}
						<div className="text-center mt-8">
							<Button variant="outline">Load More Reviews</Button>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
