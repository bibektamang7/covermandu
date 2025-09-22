import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const RecommendedProducts = () => {
	return (
		<section className="py-16 bg-muted/50">
			<div className="  mx-auto px-6">
				<h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{[
						{
							name: "Phone Stand",
							price: "Rs. 1,299",
							image: "",
						},
						{
							name: "Car Mount",
							price: "Rs. 1,999",
							image: "",
						},
						{
							name: "Power Bank",
							price: "Rs. 4,999",
							image: "",
						},
						{
							name: "Cable Organizer",
							price: "Rs. 699",
							image: "",
						},
					].map((product, index) => (
						<Card
							key={index}
							className="group hover:shadow-md transition-all duration-300"
						>
							<CardContent className="p-4">
								<div className="aspect-square overflow-hidden rounded-lg mb-4">
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								</div>
								<h3 className="font-semibold mb-2 text-sm">{product.name}</h3>
								<p className="text-primary font-bold mb-3">{product.price}</p>
								<Button
									size="sm"
									variant="outline"
									className="w-full"
								>
									Add to Cart
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default RecommendedProducts;
