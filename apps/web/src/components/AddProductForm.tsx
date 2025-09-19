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
import { Plus, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { ProductVariantItem } from "@/components/ProductVariantItem";
import { BasicInfoSection } from "@/components/BasicInfoSection";
import { productFormSchema, ProductVariant } from "@/lib/productValidation";
import { formatZodErrors, FormErrors } from "@/lib/formErrors";

interface FormData {
	name: string;
	description: string;
	price: number;
	discount: number;
	tag: string;
	category: string;
	phoneModel: string;
	availableModel: string;
}

const AddProductForm = () => {
	const { data } = useSession();
	const [formData, setFormData] = useState<FormData>({
		name: "",
		description: "",
		price: 800,
		discount: 0,
		tag: "NEW",
		category: "",
		phoneModel: "",
		availableModel: "",
	});

	const [variants, setVariants] = useState<ProductVariant[]>([
		{ color: "", stock: 0, image: null },
	]);

	const [errors, setErrors] = useState<FormErrors>({});

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
				availableModel: "",
			});
			setVariants([{ color: "", stock: 0, image: null }]);
			setErrors({});
		},
		onError: (err: any) => {
			console.error("Error creating product:", err);
			if (err.response?.data?.message) {
				alert(`Failed to create product: ${err.response.data.message}`);
			} else {
				alert("Failed to create product. Please try again.");
			}
		},
	});

	const handleInputChange = (field: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Clear error for this field when user starts typing
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
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

		// Clear errors for this variant when user starts typing
		const errorPath = `variants.${index}.${field}`;
		if (errors[errorPath]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[errorPath];
				return newErrors;
			});
		}
	};

	const addVariant = () => {
		setVariants((prev) => [...prev, { color: "", stock: 0, image: null }]);
	};

	const removeVariant = (index: number) => {
		if (variants.length > 1) {
			setVariants((prev) => prev.filter((_, i) => i !== index));

			// Remove errors for this variant
			setErrors((prev) => {
				const newErrors = { ...prev };
				const errorKeys = Object.keys(newErrors);
				errorKeys.forEach((key) => {
					if (key.startsWith(`variants.${index}`)) {
						delete newErrors[key];
					}
				});
				return newErrors;
			});
		}
	};

	const uploadToImageKit = async (file: File) => {
		try {
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
		} catch (error) {
			console.error("Error uploading image:", error);
			throw new Error("Failed to upload image");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form data
		try {
			const validatedData = productFormSchema.parse({
				...formData,
				variants,
			});

			// Clear previous errors
			setErrors({});

			// Prepare variants with uploaded images
			const updatedVariants = await Promise.all(
				validatedData.variants.map(async (variant) => {
					if (variant.image) {
						try {
							const imageUrl = await uploadToImageKit(variant.image);
							return { ...variant, image: imageUrl };
						} catch (error) {
							throw new Error(
								`Failed to upload image for variant ${variant.color}`
							);
						}
					}
					return variant;
				})
			);

			const payload = {
				...validatedData,
				price: Number(validatedData.price),
				discount: validatedData.discount ? Number(validatedData.discount) : 0,
				variants: updatedVariants,
			};

			await createProduct.mutateAsync(payload);
		} catch (err: any) {
			if (err.name === "ZodError") {
				// Handle validation errors
				const formattedErrors = formatZodErrors(err);
				setErrors(formattedErrors);
				console.error("Validation errors:", formattedErrors);
				alert("Please check the form for errors and try again.");
			} else {
				// Handle other errors
				console.error("Error submitting product:", err);
				alert(err.message || "Something went wrong while uploading product.");
			}
		}
	};

	return (
		<section className="w-full">
			<div className="py-4">
				<h2 className="font-bold text-xl">Add New Product</h2>
				<p className="font-light text-sm tracking py-1">
					Create a new product for your store. Fill in all the required
					information below.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Basic Information</CardTitle>
					</CardHeader>
					<CardContent>
						<BasicInfoSection
							formData={formData}
							onInputChange={handleInputChange}
							errors={errors}
						/>
					</CardContent>
				</Card>

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
							<ProductVariantItem
								key={index}
								variant={variant}
								index={index}
								onVariantChange={handleVariantChange}
								onInputChange={handleInputChange}
								onRemove={removeVariant}
								errors={errors}
								formData={formData}
							/>
						))}
						{errors.variants && (
							<p className="text-sm text-destructive">{errors.variants}</p>
						)}
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
