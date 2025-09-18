"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { categories, phoneModels } from "@/lib/constants";

interface ProductVariant {
	color: string;
	stock: number;
	image: File | null;
}

const AddProductForm = () => {
	const { data } = useSession();
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: 800,
		discount: 0,
		tag: "NEW",
		category: "",
		phoneModel: "",
	});

	const [variants, setVariants] = useState<ProductVariant[]>([
		{ color: "", stock: 0, image: null },
	]);

	const createProduct = useMutation({
		mutationFn: async (payload: any) => {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/products`,
				payload,
				{
					headers: {
						Authorization: `Bearer ${data?.user?.token}`,
					},
				}
			);
			return res.data;
		},
		onSuccess: () => {
			setFormData({
				name: "",
				description: "",
				price: 800,
				discount: 0,
				tag: "NEW",
				category: "",
				phoneModel: "",
			});
			setVariants([{ color: "", stock: 0, image: null }]);
		},
		onError: (err) => {
			console.error("Error creating product:", err);
			alert("Failed to create product. Please try again.");
		},
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleVariantChange = (
		index: number,
		field: keyof ProductVariant,
		value: string | File | null | number
	) => {
		setVariants((prev) =>
			prev.map((variant, i) =>
				i === index ? { ...variant, [field]: value } : variant
			)
		);
	};

	const addVariant = () => {
		setVariants((prev) => [...prev, { color: "", stock: 0, image: null }]);
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

	const uploadToImageKit = async (file: File) => {
		const { data: auth } = await axios.get(
			`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/upload`,
			{
				headers: {
					Authorization: `Bearer ${data?.user?.token}`,
				},
			}
		);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("fileName", file.name);
		formData.append("publicKey", auth.publicKey);
		formData.append("signature", auth.signature);
		formData.append("expire", auth.expire);
		formData.append("token", auth.token);
		formData.append("folder", "covermandu");

		const uploadRes = await axios.post(
			"https://upload.imagekit.io/api/v1/files/upload",
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);

		return uploadRes.data.url as string;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const updatedVariants = await Promise.all(
				variants.map(async (variant) => {
					if (variant.image) {
						const imageUrl = await uploadToImageKit(variant.image);
						return { ...variant, image: imageUrl };
					}
					return variant;
				})
			);

			const payload = {
				...formData,
				price: Number(formData.price),
				discount: formData.discount ? Number(formData.discount) : 0,
				variants: updatedVariants,
			};
			console.log("this is palyload", payload);

			await createProduct.mutateAsync(payload);
		} catch (err) {
			console.error("Error submitting product:", err);
			alert("Something went wrong while uploading product.");
		}
	};

	return (
		<section className="w-full">
			<div>
				<h2>Add New Product</h2>
				<p>
					Create a new product for your store. Fill in all the required
					information below.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				<div className="grid lg:grid-cols-2 lg:gap-8">
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
									placeholder="Describe your product..."
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
										{categories.map((categoryValue) => (
											<SelectItem
												key={categoryValue}
												value={categoryValue}
											>
												{categoryValue.replaceAll("_", " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="model">Model *</Label>
								<Select
									value={formData.phoneModel}
									onValueChange={(value) =>
										handleInputChange("phoneModel", value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select model" />
									</SelectTrigger>
									<SelectContent>
										{phoneModels.map((modelValue) => (
											<SelectItem
												key={modelValue}
												value={modelValue}
											>
												{modelValue.replaceAll("_", " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="text-lg">Product Variants</CardTitle>
							<CardDescription>
								Add different colors/variants of your product
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
												handleVariantChange(
													index,
													"stock",
													Number(e.target.value)
												)
											}
											placeholder="50"
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
													src={URL.createObjectURL(variant.image)}
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

				<div className="flex justify-end gap-3 pt-4 border-t">
					<Button
						type="button"
						variant="outline"
						disabled={createProduct.isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="btn-hero"
						disabled={createProduct.isPending}
					>
						{createProduct.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							"Add Product"
						)}
					</Button>
				</div>
			</form>
		</section>
	);
};

export default AddProductForm;
