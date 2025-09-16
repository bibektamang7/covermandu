import { DeliverySection } from "@/components/DeliverySection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/ui/Hero";
import { ProductShowcase } from "@/components/ui/ProductShowcase";
import { TestimonialsSection } from "@/components/ui/Testimonials";
import {
	dehydrate,
	HydrationBoundary,
} from "@tanstack/react-query";
import NavigationLayout from "@/components/NavigationLayout";
import PublicPageWrapper from "@/components/PageWrapper";
import { getQueryClinet } from "@/lib/getQueryClient";
import { getProducts } from "@/lib/api";


export default async function Home() {
	const queryClient = getQueryClinet();

	await queryClient.prefetchQuery({
		queryKey: ["products"],
		queryFn: getProducts,
	});

	return (
		<PublicPageWrapper>
			<NavigationLayout />
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
