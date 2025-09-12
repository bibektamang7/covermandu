import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// Mock product data
const mockProducts = [
	{
		id: 1,
		name: "Clear iPhone 15 Case",
		category: "Cases",
		price: "RS 229.99",
	},
	{
		id: 2,
		name: "Leather iPhone 15 Case",
		category: "Cases",
		price: "RS 449.99",
	},
	{
		id: 3,
		name: "Wireless Charger",
		category: "Accessories",
		price: "RS 439.99",
	},
	{
		id: 4,
		name: "Screen Protector",
		category: "Accessories",
		price: "RS 419.99",
	},
	{
		id: 5,
		name: "iPhone 14 Clear Case",
		category: "Cases",
		price: "RS 824.99",
	},
	{
		id: 6,
		name: "Magnetic Car Mount",
		category: "Accessories",
		price: "$34.99",
	},
];

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredProducts = mockProducts.filter(
		(product) =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.category.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const clearSearch = () => {
		setSearchQuery("");
	};

	const handleProductClick = (productId: number) => {
		// Navigate to product detail page (for now just close dialog)
		onOpenChange(false);
		// In a real app, you'd navigate to /product/:id
		window.location.href = `/product/${productId}`;
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Search Products</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Search Input */}
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

					{/* Search Results */}
					<div className="max-h-96 overflow-y-auto">
						{searchQuery ? (
							filteredProducts.length > 0 ? (
								<div className="space-y-2">
									<p className="text-sm text-muted-foreground mb-3">
										{filteredProducts.length} result
										{filteredProducts.length !== 1 ? "s" : ""} found
									</p>
									{filteredProducts.map((product) => (
										<div
											key={product.id}
											className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
											onClick={() => handleProductClick(product.id)}
										>
											<div className="flex items-center gap-3">
												<div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
													<Search className="w-5 h-5 text-muted-foreground" />
												</div>
												<div>
													<h4 className="font-medium">{product.name}</h4>
													<div className="flex items-center gap-2 mt-1">
														<Badge
															variant="secondary"
															className="text-xs"
														>
															{product.category}
														</Badge>
														<span className="text-sm font-medium text-primary">
															{product.price}
														</span>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8">
									<Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-muted-foreground">
										No products found for "{searchQuery}"
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										Try searching for cases, accessories, or phone models
									</p>
								</div>
							)
						) : (
							<div className="space-y-4">
								<div>
									<h4 className="font-medium mb-2">Popular Searches</h4>
									<div className="flex flex-wrap gap-2">
										{[
											"iPhone 15",
											"Clear Case",
											"Wireless Charger",
											"Screen Protector",
										].map((term) => (
											<Button
												key={term}
												variant="outline"
												size="sm"
												onClick={() => setSearchQuery(term)}
												className="text-xs"
											>
												{term}
											</Button>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-medium mb-2">Categories</h4>
									<div className="grid grid-cols-2 gap-2">
										{["Cases", "Accessories"].map((category) => (
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
