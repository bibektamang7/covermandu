import { DeliverySection } from "@/components/DeliverySection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/ui/Hero";
import { ProductShowcase } from "@/components/ProductShowcase";
import { TestimonialsSection } from "@/components/ui/Testimonials";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PublicPageWrapper from "@/components/PageWrapper";
import { getQueryClinet } from "@/lib/getQueryClient";
import { getProducts } from "@/lib/api";
import { Navigation } from "@/components/Navigation";

export default async function Home() {
	const queryClient = getQueryClinet();

	await queryClient.prefetchQuery({
		queryKey: ["products"],
		queryFn: async () => {
			return await getProducts();
		},
	});

	return (
		<PublicPageWrapper>
			<Navigation />
			<main className="w-full min-h-screen">
				<Hero />
				<HydrationBoundary state={dehydrate(queryClient)}>
					<ProductShowcase />
				</HydrationBoundary>
				<DeliverySection />
				<TestimonialsSection />
			</main>
			<Footer />
		</PublicPageWrapper>
	);
}
