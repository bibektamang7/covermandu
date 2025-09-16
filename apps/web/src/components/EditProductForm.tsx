import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, Plus } from "lucide-react";

interface ProductVariant {
	id?: string;
	color: string;
	stock: number | string;
	image: File | string | null;
	sku: string;
}

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	discount?: number;
	tag: "NEW" | "TRENDING" | "MOST_LIKED" | "POPULAR" | "PREMIUM";
	variants?: ProductVariant[];
}

interface EditProductFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: Product | null;
}

const EditProductForm = ({
	open,
	onOpenChange,
	product,
}: EditProductFormProps) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		discount: "",
		tag: "NEW",
	});

	const [variants, setVariants] = useState<ProductVariant[]>([
		{ color: "", stock: "", image: null, sku: "" },
	]);

	// Pre-fill form when product changes
	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name || "",
				description: product.description || "",
				price: product.price.toString() || "",
				discount: product.discount?.toString() || "",
				tag: product.tag || "NEW",
			});

			if (product.variants && product.variants.length > 0) {
				setVariants(
					product.variants.map((v) => ({
						id: v.id,
						color: v.color,
						stock: v.stock.toString(),
						image: v.image,
						sku: v.sku,
					}))
				);
			} else {
				setVariants([{ color: "", stock: "", image: null, sku: "" }]);
			}
		}
	}, [product]);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleVariantChange = (
		index: number,
		field: keyof ProductVariant,
		value: string | File | null
	) => {
		setVariants((prev) =>
			prev.map((variant, i) =>
				i === index ? { ...variant, [field]: value } : variant
			)
		);
	};

	const addVariant = () => {
		setVariants((prev) => [
			...prev,
			{ color: "", stock: "", image: null, sku: "" },
		]);
	};

	const removeVariant = (index: number) => {
		if (variants.length > 1) {
			setVariants((prev) => prev.filter((_, i) => i !== index));
		}
	};

	const handleImageUpload = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0] || null;
		handleVariantChange(index, "image", file);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send the data to your backend
		console.log("Updated product data:", {
			product: { ...formData, id: product?.id },
			variants,
		});
		// Close modal
		onOpenChange(false);
	};

	if (!product) return null;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Product</DialogTitle>
					<DialogDescription>
						Update the product information below. Make changes and save to
						update your catalog.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="space-y-6"
				>
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Basic Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Product Name *</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									placeholder="iPhone 15 Pro Max Case"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description *</Label>
								<Textarea
									id="description"
									value={formData.description}
									onChange={(e) =>
										handleInputChange("description", e.target.value)
									}
									placeholder="Describe your product features, materials, and benefits..."
									rows={4}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="tag">Product Tag *</Label>
								<Select
									value={formData.tag}
									onValueChange={(value) => handleInputChange("tag", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select tag" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="NEW">New</SelectItem>
										<SelectItem value="TRENDING">Trending</SelectItem>
										<SelectItem value="MOST_LIKED">Most Liked</SelectItem>
										<SelectItem value="POPULAR">Popular</SelectItem>
										<SelectItem value="PREMIUM">Premium</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					{/* Pricing */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Pricing</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="price">Price (Rs.) *</Label>
									<Input
										id="price"
										type="number"
										step="0.01"
										value={formData.price}
										onChange={(e) => handleInputChange("price", e.target.value)}
										placeholder="2999.00"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="discount">Discount (%)</Label>
									<Input
										id="discount"
										type="number"
										min="0"
										max="100"
										value={formData.discount}
										onChange={(e) =>
											handleInputChange("discount", e.target.value)
										}
										placeholder="10"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Product Variants */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-lg">Product Variants</CardTitle>
								<CardDescription>
									Edit different colors/variants of your product
								</CardDescription>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addVariant}
							>
								<Plus className="w-4 h-4 mr-2" />
								Add Variant
							</Button>
						</CardHeader>
						<CardContent className="space-y-6">
							{variants.map((variant, index) => (
								<div
									key={index}
									className="border rounded-lg p-4 space-y-4"
								>
									<div className="flex items-center justify-between">
										<h4 className="font-medium">Variant {index + 1}</h4>
										{variants.length > 1 && (
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeVariant(index)}
												className="text-destructive hover:text-destructive"
											>
												<X className="w-4 h-4" />
											</Button>
										)}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor={`color-${index}`}>Color *</Label>
											<Input
												id={`color-${index}`}
												value={variant.color}
												onChange={(e) =>
													handleVariantChange(index, "color", e.target.value)
												}
												placeholder="e.g., Blue, Red, Black"
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor={`stock-${index}`}>Stock *</Label>
											<Input
												id={`stock-${index}`}
												type="number"
												value={variant.stock}
												onChange={(e) =>
													handleVariantChange(index, "stock", e.target.value)
												}
												placeholder="50"
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor={`sku-${index}`}>SKU *</Label>
											<Input
												id={`sku-${index}`}
												value={variant.sku}
												onChange={(e) =>
													handleVariantChange(index, "sku", e.target.value)
												}
												placeholder="IP15-CASE-BLU-001"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor={`image-${index}`}>Variant Image</Label>
										<div className="flex items-center gap-4">
											<div className="flex-1">
												<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
													<div className="text-center">
														<Upload className="mx-auto h-8 w-8 text-muted-foreground" />
														<div className="mt-2">
															<Label
																htmlFor={`image-${index}`}
																className="cursor-pointer"
															>
																<span className="text-sm font-medium text-foreground">
																	Click to upload image for{" "}
																	{variant.color || `Variant ${index + 1}`}
																</span>
															</Label>
															<Input
																id={`image-${index}`}
																type="file"
																accept="image/*"
																onChange={(e) => handleImageUpload(index, e)}
																className="hidden"
															/>
														</div>
													</div>
												</div>
											</div>

											{variant.image && (
												<div className="relative">
													<img
														src={
															variant.image instanceof File
																? URL.createObjectURL(variant.image)
																: variant.image
														}
														alt={`${variant.color} variant`}
														className="w-20 h-20 object-cover rounded-lg border"
													/>
													<Button
														type="button"
														variant="destructive"
														size="sm"
														className="absolute -top-2 -right-2 h-6 w-6 p-0"
														onClick={() =>
															handleVariantChange(index, "image", null)
														}
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					{/* Form Actions */}
					<div className="flex justify-end gap-3 pt-4 border-t">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit">Save Changes</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditProductForm;
