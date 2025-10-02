import { useSession } from "next-auth/react";
import { useState } from "react";
import { productFormSchema, ProductVariant } from "@/lib/productValidation";
import { formatZodErrors, FormErrors } from "@/lib/formErrors";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

export const useAddProductForm = () => {
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
		{ color: "", stock: 0, image: null, phoneModel: "" },
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
			setVariants([{ color: "", stock: 0, image: null, phoneModel: "" }]);
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
		setVariants((prev) => [
			...prev,
			{ color: "", stock: 0, image: null, phoneModel: "" },
		]);
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
			console.log(variants);
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
							return {
								...variant,
								image: imageUrl,
							};
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

	return {
		handleInputChange,
		handleSubmit,
		handleVariantChange,
		removeVariant,
		addVariant,
		formData,
		errors,
		createProduct,
		variants,
	};
};
