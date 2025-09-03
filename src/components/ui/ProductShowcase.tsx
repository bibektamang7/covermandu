import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";

const products = [
	{
		id: 1,
		name: "Crystal Clear Pro",
		price: "RS 1,299",
		originalPrice: "RS 1,599",
		rating: 4.8,
		reviews: 124,
		image: "./1.jpg",
		colors: ["transparent", "smoke", "blue"],
		tag: "Best Seller",
	},
	{
		id: 2,
		name: "Urban Shield",
		price: "RS 999",
		originalPrice: "RS 1,299",
		rating: 4.9,
		reviews: 89,
		image: "./1.jpg",
		colors: ["black", "navy", "forest"],
		tag: "New",
	},
	{
		id: 3,
		name: "Gradient Glow",
		price: "RS 1,499",
		originalPrice: "RS 1,799",
		rating: 4.7,
		reviews: 156,
		image: "./1.jpg",
		colors: ["sunset", "ocean", "aurora"],
		tag: "Limited",
	},
	{
		id: 4,
		name: "Minimalist Matte",
		price: "RS 899",
		originalPrice: "RS 1,199",
		rating: 4.6,
		reviews: 78,
		image: "./1.jpg",
		colors: ["white", "sand", "stone"],
		tag: "Popular",
	},
];

export const ProductShowcase = () => {
	return (
		<section className="py-20 px-16 bg-gradient-to-b from-background to-secondary/20">
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center mb-16 space-y-4">
					<h2 className="text-4xl lg:text-5xl font-bold text-balance">
						Our <span className="text-gradient">Premium Collection</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Handpicked cases designed for style, protection, and your lifestyle
					</p>
				</div>

				{/* Product Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{products.map((product, index) => (
						<Card
							key={product.id}
							className="product-card glow-on-hover"
							style={{
								animationDelay: `${index * 0.2}s`,
								animation: "slideInFromBottom 0.8s ease-out forwards",
							}}
						>
							{/* Product Image */}
							<div className="relative overflow-hidden">
								<img
									src={product.image}
									alt={product.name}
									className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
								/>

								{/* Tag */}
								<div className="absolute top-3 left-3">
									<span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
										{product.tag}
									</span>
								</div>

								{/* Quick Actions */}
								<div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<Button
										size="sm"
										variant="secondary"
										className="w-8 h-8 p-0 rounded-full"
									>
										<Heart className="w-4 h-4" />
									</Button>
								</div>

								{/* Color Options */}
								<div className="absolute bottom-3 left-3 flex gap-1">
									{product.colors.map((color, i) => (
										<div
											key={i}
											className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
											style={{
												backgroundColor:
													color === "transparent"
														? "rgba(255,255,255,0.3)"
														: color === "smoke"
														? "#6B7280"
														: color === "blue"
														? "#3B82F6"
														: color === "black"
														? "#1F2937"
														: color === "navy"
														? "#1E3A8A"
														: color === "forest"
														? "#166534"
														: color === "sunset"
														? "#F59E0B"
														: color === "ocean"
														? "#0EA5E9"
														: color === "aurora"
														? "#8B5CF6"
														: color === "white"
														? "#F9FAFB"
														: color === "sand"
														? "#F3E8C6"
														: color === "stone"
														? "#A8A29E"
														: color,
											}}
										/>
									))}
								</div>
							</div>

							{/* Product Info */}
							<div className="p-4 space-y-3">
								<div className="space-y-1">
									<h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
										{product.name}
									</h3>

									{/* Rating */}
									<div className="flex items-center gap-2">
										<div className="flex items-center">
											<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
											<span className="text-sm font-medium ml-1">
												{product.rating}
											</span>
										</div>
										<span className="text-sm text-muted-foreground">
											({product.reviews} reviews)
										</span>
									</div>
								</div>

								{/* Price */}
								<div className="flex items-center gap-2">
									<span className="text-xl font-bold text-primary">
										{product.price}
									</span>
									<span className="text-sm text-muted-foreground line-through">
										{product.originalPrice}
									</span>
								</div>

								{/* Add to Cart */}
								<Button className="w-full group">
									<ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
									Add to Cart
								</Button>
							</div>
						</Card>
					))}
				</div>

				{/* View All CTA */}
				<div className="text-center mt-12">
					<Button
						variant="outline"
						size="lg"
						className="btn-ghost"
					>
						View All Cases
					</Button>
				</div>
			</div>
		</section>
	);
};
