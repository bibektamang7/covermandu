import { Card } from "@/components/ui/card";
import { MapPin, Clock, Shield, Truck } from "lucide-react";
// import nepalMap from "@/assets/nepal-delivery.jpg";

const features = [
	{
		icon: MapPin,
		title: "77 Districts Coverage",
		description: "We deliver to all districts across Nepal",
	},
	{
		icon: Clock,
		title: "2-5 Days Delivery",
		description: "Fast and reliable delivery timeline",
	},
	{
		icon: Shield,
		title: "Secure Packaging",
		description: "Your cases arrive in perfect condition",
	},
	{
		icon: Truck,
		title: "Free Shipping",
		description: "Free delivery on orders above RS 1,000",
	},
];

const majorCities = [
	{ name: "Kathmandu", x: "52%", y: "40%" },
	{ name: "Pokhara", x: "35%", y: "45%" },
	{ name: "Chitwan", x: "45%", y: "60%" },
	{ name: "Biratnagar", x: "85%", y: "35%" },
	{ name: "Dharan", x: "78%", y: "45%" },
	{ name: "Butwal", x: "28%", y: "65%" },
];

export const DeliverySection = () => {
	return (
		<section className="py-20 px-16 bg-gradient-to-br from-accent/10 via-background to-primary/5">
			<div className="container mx-auto px-6">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-8">
						<div className="space-y-4">
							<h2 className="text-4xl lg:text-5xl font-bold text-balance">
								<span className="text-gradient">Nationwide</span> Delivery
							</h2>
							<p className="text-xl text-muted-foreground">
								From the mountains of Everest to the plains of Terai, we bring
								premium iPhone protection to your doorstep.
							</p>
						</div>

						{/* Features Grid */}
						<div className="grid sm:grid-cols-2 gap-4">
							{features.map((feature, index) => (
								<Card
									key={index}
									className="p-4 border-none bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300"
									style={{
										animationDelay: `${index * 0.1}s`,
										animation: "slideInFromLeft 0.8s ease-out forwards",
									}}
								>
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
											<feature.icon className="w-5 h-5 text-primary" />
										</div>
										<div className="space-y-1">
											<h3 className="font-semibold">{feature.title}</h3>
											<p className="text-sm text-muted-foreground">
												{feature.description}
											</p>
										</div>
									</div>
								</Card>
							))}
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-8 pt-6 border-t border-border/50">
							<div className="text-center">
								<div className="text-3xl font-bold text-primary">2-5</div>
								<div className="text-sm text-muted-foreground">
									Days Delivery
								</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-primary">77</div>
								<div className="text-sm text-muted-foreground">Districts</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-primary">99%</div>
								<div className="text-sm text-muted-foreground">On Time</div>
							</div>
						</div>
					</div>

					{/* Right Content - Interactive Map */}
					<div className="relative">
						<div className="relative rounded-2xl overflow-hidden shadow-2xl">
							<img
								src={"./NepalMap.jpg"}
								alt="Nepal Delivery Coverage"
								className="w-full h-auto"
							/>

							{/* Animated Pins */}
							{majorCities.map((city, index) => (
								<div
									key={city.name}
									className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
									style={{
										left: city.x,
										top: city.y,
										animationDelay: `${index * 0.5}s`,
									}}
								>
									<div className="relative">
										<div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
										<div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-card px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
											{city.name}
										</div>
									</div>
								</div>
							))}

							{/* Animated Routes */}
							<div className="absolute inset-0 pointer-events-none">
								<svg
									className="w-full h-full"
									viewBox="0 0 100 100"
									preserveAspectRatio="none"
								>
									{majorCities.slice(0, -1).map((city, index) => {
										const nextCity = majorCities[index + 1];
										return (
											<line
												key={index}
												x1={city.x}
												y1={city.y}
												x2={nextCity.x}
												y2={nextCity.y}
												stroke="var(--primary)"
												strokeWidth="0.5"
												strokeOpacity="0.3"
												strokeDasharray="2,2"
												className="animate-pulse"
												style={{ animationDelay: `${index * 0.3}s` }}
											/>
										);
									})}
								</svg>
							</div>
						</div>

						{/* Floating Delivery Card */}
						<div className="absolute -bottom-6 -right-6 bg-card rounded-xl p-4 shadow-xl border animate-[fadeInScale_1s_ease-out_1s_both]">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
									<Truck className="w-5 h-5 text-green-600" />
								</div>
								<div>
									<div className="font-semibold text-sm">Express Delivery</div>
									<div className="text-xs text-muted-foreground">
										Track your order
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
