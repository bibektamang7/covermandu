import { DeliverySection } from "@/components/DeliverySection";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/ui/Hero";
import { ProductShowcase } from "@/components/ui/ProductShowcase";
import { TestimonialsSection } from "@/components/ui/Testimonials";

export default function Home() {
	return (
		<section className="w-full">
			<Navigation />
			<main className="w-full min-h-screen">
				<Hero />
				<ProductShowcase />
				<DeliverySection />
				<TestimonialsSection />
			</main>
			<Footer />
		</section>
	);
}
