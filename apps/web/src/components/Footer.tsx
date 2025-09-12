import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Facebook,
	Instagram,
	Mail,
	Phone,
	MapPin,
	Twitter,
} from "lucide-react";

export const Footer = () => {
	return (
		<footer className="bg-gradient-to-br from-muted/30 to-secondary/20 border-t border-border/50">
			<div className="border-b border-border/50">
				<div className="container mx-auto px-6 py-12">
					<div className="text-center space-y-4 max-w-2xl mx-auto">
						<h3 className="text-2xl font-bold">Stay Updated</h3>
						<p className="text-muted-foreground">
							Get the latest updates on new arrivals, exclusive offers, and
							delivery updates
						</p>
						<div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
							<Input
								placeholder="Enter your email"
								className="flex-1"
							/>
							<Button className="btn-hero">Subscribe</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Footer */}
			<div className="container mx-auto px-6 py-12">
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="space-y-4">
						<div className="space-y-2">
							<h3 className="text-2xl font-bold text-gradient">Covermandu</h3>
							<p className="text-muted-foreground">
								Nepal's premier destination for premium iPhone cases. Style
								meets protection, delivered nationwide.
							</p>
						</div>

						{/* Social Links */}
						<div className="flex gap-3">
							<Button
								size="sm"
								variant="outline"
								className="w-10 h-10 p-0 rounded-full"
							>
								<Facebook className="w-4 h-4" />
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="w-10 h-10 p-0 rounded-full"
							>
								<Instagram className="w-4 h-4" />
							</Button>
						</div>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h4 className="font-semibold text-lg">Quick Links</h4>
						<ul className="space-y-2">
							{[
								"All Cases",
								"iPhone 15 Cases",
								"iPhone 14 Cases",
								"iPhone 13 Cases",
							].map((link) => (
								<li key={link}>
									<a
										href="#"
										className="text-muted-foreground hover:text-primary transition-colors"
									>
										{link}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold text-lg">Support</h4>
						<ul className="space-y-2">
							{["Track Order", "Shipping Info", "FAQ"].map((link) => (
								<li key={link}>
									<a
										href="#"
										className="text-muted-foreground hover:text-primary transition-colors"
									>
										{link}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold text-lg">Contact</h4>
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<Phone className="w-5 h-5 text-primary" />
								<span className="text-muted-foreground">+977 9813561053</span>
							</div>
							<div className="flex items-center gap-3">
								<Mail className="w-5 h-5 text-primary" />
								<span className="text-muted-foreground">
									hello@covermandu.com
								</span>
							</div>
							<div className="flex items-start gap-3">
								<MapPin className="w-5 h-5 text-primary mt-0.5" />
								<span className="text-muted-foreground">
									Basantapur, Kathmandu
									<br />
									Nepal
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="border-t border-border/50">
				<div className="container mx-auto px-6 py-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-muted-foreground text-sm">
							© 2025 Covermandu. All rights reserved.
						</p>
						<div className="flex gap-6 text-sm">
							<a
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Terms of Service
							</a>
							<a
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Shipping Policy
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
