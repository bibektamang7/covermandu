import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
	{
		id: 1,
		name: "Priya Sharma",
		location: "Kathmandu",
		rating: 5,
		text: "Amazing quality! The case arrived in just 2 days and fits perfectly on my iPhone 14 Pro. Love the minimalist design.",
		avatar: "PS",
	},
	{
		id: 2,
		name: "Rahul Thapa",
		location: "Pokhara",
		rating: 5,
		text: "Best phone case I've ever bought. The delivery to Pokhara was super fast and the packaging was excellent.",
		avatar: "RT",
	},
	{
		id: 3,
		name: "Anita Gurung",
		location: "Chitwan",
		rating: 5,
		text: "Crystal clear case is just perfect! Protects my phone while showing off its original color. Highly recommended!",
		avatar: "AG",
	},
	{
		id: 4,
		name: "Bikash KC",
		location: "Biratnagar",
		rating: 5,
		text: "Impressed with the quality and fast delivery. The customer service team was also very helpful with my queries.",
		avatar: "BK",
	},
	{
		id: 5,
		name: "Sita Rai",
		location: "Dharan",
		rating: 5,
		text: "The gradient case is absolutely stunning! Gets compliments everywhere I go. Worth every rupee!",
		avatar: "SR",
	},
	{
		id: 6,
		name: "Arun Poudel",
		location: "Butwal",
		rating: 5,
		text: "Great protection for my phone. Dropped it multiple times and no damage at all. Covermandu is the best!",
		avatar: "AP",
	},
];

export const TestimonialsSection = () => {
	return (
		<section className="py-20 px-16 bg-gradient-to-b from-background to-muted/20">
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center mb-16 space-y-4">
					<h2 className="text-4xl lg:text-5xl font-bold text-balance">
						What Our <span className="text-gradient">Customers Say</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Join thousands of satisfied customers across Nepal who trust
						Covermandu for their iPhone protection
					</p>

					{/* Overall Rating */}
					<div className="flex items-center justify-center gap-4 mt-8">
						<div className="flex items-center gap-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className="w-6 h-6 fill-yellow-400 text-yellow-400"
								/>
							))}
						</div>
						<div className="text-2xl font-bold">4.9</div>
						<div className="text-muted-foreground">from 1,247+ reviews</div>
					</div>
				</div>

				{/* Testimonials Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{testimonials.map((testimonial, index) => (
						<Card
							key={testimonial.id}
							className="p-6 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:scale-105 hover:shadow-xl group"
							style={{
								animationDelay: `${index * 0.1}s`,
								animation: "slideInFromBottom 0.8s ease-out forwards",
							}}
						>
							{/* Quote Icon */}
							<div className="mb-4">
								<Quote className="w-8 h-8 text-primary/30 group-hover:text-primary/50 transition-colors" />
							</div>

							{/* Rating */}
							<div className="flex items-center gap-1 mb-3">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star
										key={i}
										className="w-4 h-4 fill-yellow-400 text-yellow-400"
									/>
								))}
							</div>

							{/* Testimonial Text */}
							<p className="text-foreground mb-4 leading-relaxed">
								"{testimonial.text}"
							</p>

							{/* Customer Info */}
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
									{testimonial.avatar}
								</div>
								<div>
									<div className="font-semibold text-sm">
										{testimonial.name}
									</div>
									<div className="text-xs text-muted-foreground">
										{testimonial.location}
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>

				{/* Social Proof */}
				<div className="mt-16 text-center">
					<div className="inline-flex items-center gap-4 bg-card/50 backdrop-blur-sm rounded-full px-6 py-3 border">
						<div className="flex -space-x-2">
							{testimonials.slice(0, 4).map((testimonial, index) => (
								<div
									key={index}
									className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-xs border-2 border-background"
								>
									{testimonial.avatar}
								</div>
							))}
						</div>
						<span className="text-sm font-medium">
							Trusted by 10,000+ customers in Nepal
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};
