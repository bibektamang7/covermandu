import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useSearchProducts } from "@/hooks/useSearchProducts";
import { Product, Category } from "@/types/product";
import SearchedProductLists from "./SearchedProductLists";

interface SearchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const formatPrice = (price: number) => {
	return `RS ${price}`;
};

const getCategoryName = (category: Category) => {
	return category
		.toString()
		.replace(/_/g, " ")
		.toLowerCase()
		.replace(/\b\w/g, (l) => l.toUpperCase());
};

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300);

		return () => {
			clearTimeout(timer);
		};
	}, [searchQuery]);

	const { data, isLoading, isError } = useSearchProducts({
		search: debouncedSearchQuery,
		limit: 10,
	});

	const clearSearch = () => {
		setSearchQuery("");
	};

	const handleProductClick = (productId: string) => {
		onOpenChange(false);
		window.location.href = `/product/${productId}`;
	};

	// Use API data if available, otherwise fallback to empty array
	const products = data?.products || [];

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				className="sm:max-w-2xl"
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle>Search Products</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input
							placeholder="Search for cases, accessories..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 pr-10"
							autoFocus
						/>
						{searchQuery && (
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0"
								onClick={clearSearch}
							>
								<X className="w-4 h-4" />
							</Button>
						)}
					</div>

					<div className="max-h-96 overflow-y-auto">
						{searchQuery ? (
							isLoading ? (
								<div className="text-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
									<p className="text-muted-foreground">Searching products...</p>
								</div>
							) : isError ? (
								<div className="text-center py-8">
									<Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-muted-foreground">
										Failed to search products. Please try again.
									</p>
								</div>
							) : (
								products.length > 0 && (
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground mb-3">
											{products.length} result
											{products.length !== 1 ? "s" : ""} found
										</p>
										<SearchedProductLists
											products={products}
											handleProductClick={handleProductClick}
											search={searchQuery}
										/>
									</div>
								)
							)
						) : (
							<div className="space-y-4">
								<div>
									<h4 className="font-medium mb-2">Popular Searches</h4>
									<div className="flex flex-wrap gap-2">
										{["iPhone 15", "Clear Case", "iPhone 14", "Flip Case"].map(
											(term) => (
												<Button
													key={term}
													variant="outline"
													size="sm"
													onClick={() => setSearchQuery(term)}
													className="text-xs"
												>
													{term}
												</Button>
											)
										)}
									</div>
								</div>

								<div>
									<h4 className="font-medium mb-2">Categories</h4>
									<div className="grid grid-cols-2 gap-2">
										{["Cases", "Phone Models"].map((category) => (
											<Button
												key={category}
												variant="ghost"
												className="justify-start h-auto p-3"
												onClick={() => setSearchQuery(category)}
											>
												<div>
													<div className="font-medium">{category}</div>
													<div className="text-xs text-muted-foreground">
														Browse all {category.toLowerCase()}
													</div>
												</div>
											</Button>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
