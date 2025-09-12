import { useState } from "react";
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
import { Upload, X } from "lucide-react";

interface AddProductFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const AddProductForm = ({ open, onOpenChange }: AddProductFormProps) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		category: "",
		price: "",
		originalPrice: "",
		stock: "",
		sku: "",
		images: [] as File[],
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
	};

	const removeImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send the data to your backend
		console.log("Product data:", formData);
		// Reset form and close modal
		setFormData({
			name: "",
			description: "",
			category: "",
			price: "",
			originalPrice: "",
			stock: "",
			sku: "",
			images: [],
		});
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Product</DialogTitle>
					<DialogDescription>
						Create a new product for your store. Fill in all the required
						information below.
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
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
									<Label htmlFor="category">Category *</Label>
									<Select
										value={formData.category}
										onValueChange={(value) =>
											handleInputChange("category", value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="cases">Cases</SelectItem>
											<SelectItem value="accessories">Accessories</SelectItem>
											<SelectItem value="protection">Protection</SelectItem>
											<SelectItem value="chargers">Chargers</SelectItem>
											<SelectItem value="stands">Stands</SelectItem>
										</SelectContent>
									</Select>
								</div>
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
						</CardContent>
					</Card>

					{/* Pricing & Inventory */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Pricing & Inventory</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="price">Selling Price (Rs.) *</Label>
									<Input
										id="price"
										type="number"
										value={formData.price}
										onChange={(e) => handleInputChange("price", e.target.value)}
										placeholder="2999"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="originalPrice">Original Price (Rs.)</Label>
									<Input
										id="originalPrice"
										type="number"
										value={formData.originalPrice}
										onChange={(e) =>
											handleInputChange("originalPrice", e.target.value)
										}
										placeholder="3999"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="stock">Stock Quantity *</Label>
									<Input
										id="stock"
										type="number"
										value={formData.stock}
										onChange={(e) => handleInputChange("stock", e.target.value)}
										placeholder="50"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
								<Input
									id="sku"
									value={formData.sku}
									onChange={(e) => handleInputChange("sku", e.target.value)}
									placeholder="IP15-CASE-001"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Product Images */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Product Images</CardTitle>
							<CardDescription>
								Upload product images. First image will be the main display
								image.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
								<div className="text-center">
									<Upload className="mx-auto h-12 w-12 text-muted-foreground" />
									<div className="mt-4">
										<Label
											htmlFor="images"
											className="cursor-pointer"
										>
											<span className="mt-2 block text-sm font-medium text-foreground">
												Click to upload images
											</span>
											<span className="mt-1 block text-xs text-muted-foreground">
												PNG, JPG, GIF up to 10MB each
											</span>
										</Label>
										<Input
											id="images"
											type="file"
											multiple
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
									</div>
								</div>
							</div>

							{formData.images.length > 0 && (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{formData.images.map((file, index) => (
										<div
											key={index}
											className="relative group"
										>
											<img
												src={URL.createObjectURL(file)}
												alt={`Product ${index + 1}`}
												className="w-full h-24 object-cover rounded-lg border"
											/>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() => removeImage(index)}
											>
												<X className="h-3 w-3" />
											</Button>
											{index === 0 && (
												<div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
													Main
												</div>
											)}
										</div>
									))}
								</div>
							)}
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
						<Button
							type="submit"
							className="btn-hero"
						>
							Add Product
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddProductForm;
