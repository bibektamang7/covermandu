import { DeliverySection } from "@/components/DeliverySection";
import { Hero } from "@/components/ui/Hero";
import { ProductShowcase } from "@/components/ui/ProductShowcase";
import { TestimonialsSection } from "@/components/ui/Testimonials";

export default function Home() {
	return (
		<section className="w-full">
			<Hero />
			<ProductShowcase />
			<DeliverySection />
			<TestimonialsSection />
		</section>
	);
}
