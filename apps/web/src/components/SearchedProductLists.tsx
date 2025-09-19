import { Product } from "@/types/product";
import { Search } from "lucide-react";
import React from "react";
import { Category, PhoneModel } from "@/types/product";

function highlightMatch(text: string, query: string) {
	if (!query) return text;
	const regex = new RegExp(`(${query})`, "ig");
	return text.split(regex).map((part, i) =>
		part.toLowerCase() === query.toLowerCase() ? (
			<span
				key={i}
				className="text-primary font-semibold"
			>
				{part}
			</span>
		) : (
			part
		)
	);
}

const SearchedProductLists = ({
	products,
	search,
	handleProductClick,
}: {
	products: Product[];
	search: string;
	handleProductClick: (productId: string) => void;
}) => {
	return products.map((product: Product) => {
		const input = search.toLowerCase();
		let displayText = product.name;
		const normalizeCategory = product.category
			.toString()
			.toLowerCase()
			.replaceAll("_", " ");
		const normalizePhoneModel = product.phoneModel
			.toString()
			.toLocaleLowerCase()
			.replaceAll("_", " ");

		const isProductNameEqual =
			product.name.toLowerCase().includes(input) === true;
		if (
			product.category &&
			normalizeCategory.includes(input) &&
			!isProductNameEqual
		) {
			displayText = normalizeCategory;
		} else if (
			product.phoneModel &&
			normalizePhoneModel.includes(input) &&
			!isProductNameEqual
		) {
			displayText = normalizePhoneModel;
		}

		return (
			<div
				key={product.id}
				className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
				onClick={() => handleProductClick(product.id)}
			>
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
						<Search className="text-muted-foreground" />
					</div>
					<div>
						<h4 className="font-medium">
							{highlightMatch(displayText, search)}
						</h4>
						<div className="flex items-center gap-2 mt-1">
							{/* you can also show category + phone model badges here */}
						</div>
					</div>
				</div>
			</div>
		);
	});
};

export default SearchedProductLists;
