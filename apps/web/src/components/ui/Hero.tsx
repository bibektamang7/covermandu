import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Star } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
	return (
		<section className="lg:px-16 relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-accent/20">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			</div>

			<div className="w-full px-6 py-20 relative z-10">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-8 text-center lg:text-left">
						<div className="space-y-4">
							<div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary animate-[slideInFromLeft_0.8s_ease-out]">
								🇳🇵 Made for Nepal
							</div>
							<h1 className="text-4xl md:text-6xl font-bold text-balance animate-[slideInFromLeft_0.8s_ease-out_0.2s_both]">
								Premium
								<span className="text-gradient block">iPhone Cases</span>
								for Nepal
							</h1>
							<p className="text-muted-foreground mx-auto max-w-lg animate-[slideInFromLeft_0.8s_ease-out_0.4s_both]">
								Stylish protection delivered across all 77 districts of Nepal.
								Premium quality, fast delivery, unbeatable style.
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start animate-[slideInFromLeft_0.8s_ease-out_0.6s_both]">
							<div className="flex items-center gap-2">
								<Shield className="w-5 h-5 text-primary" />
								<span className="text-sm font-medium">Premium Protection</span>
							</div>
							<div className="flex items-center gap-2">
								<Truck className="w-5 h-5 text-primary" />
								<span className="text-sm font-medium">Fast Delivery</span>
							</div>
							<div className="flex items-center gap-2">
								<Star className="w-5 h-5 text-primary" />
								<span className="text-sm font-medium">5-Star Rated</span>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-[slideInFromLeft_0.8s_ease-out_0.8s_both]">
							<Link href={"/products"}>
								<Button className="btn-hero group">
									Shop Cases Now
									<ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
								</Button>
							</Link>
							<Link href={"/login"}>
								<Button
									variant="outline"
									className="btn-ghost"
								>
									Get Started
								</Button>
							</Link>
						</div>
					</div>

					<div className="relative animate-[slideInFromRight_0.8s_ease-out_0.4s_both]">
						<div className="relative max-w-lg mx-auto">
							<div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl scale-75 animate-pulse"></div>

							<div className="relative float-animation">
								<img
									src={"./heroIphone.jpg"}
									alt="Premium iPhone Case"
									className="w-full h-auto relative z-10 drop-shadow-2xl rounded-2xl"
								/>
							</div>

							<div className="absolute -top-4 -right-4 bg-card rounded-xl p-3 shadow-lg border animate-[fadeInScale_1s_ease-out_1.2s_both]">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
									<span className="text-sm font-medium">In Stock</span>
								</div>
							</div>

							<div className="absolute -bottom-4 -left-4 bg-card rounded-xl md:p-4 p-2 shadow-lg border animate-[fadeInScale_1s_ease-out_1.4s_both]">
								<div className="text-center">
									<div className="text-xl font-bold text-primary">RS 699</div>
									<div className="text-xs text-muted-foreground">
										Starting from
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
				<div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
					<div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
				</div>
			</div>
		</section>
	);
};
