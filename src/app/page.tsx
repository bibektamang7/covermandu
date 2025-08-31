import { DeliverySection } from "@/components/DeliverySection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/ui/Hero";
import { Navigation } from "@/components/ui/Navigation";
import { ProductShowcase } from "@/components/ui/ProductShowcase";
import { TestimonialsSection } from "@/components/ui/Testimonials";

export default function Home() {
	return (
		<div className="min-h-screen">
			<Navigation />
			<main>
				<Hero />
				<ProductShowcase />
				<DeliverySection />
				<TestimonialsSection />
			</main>
			<Footer />
		</div>
	);
}
