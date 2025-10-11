import { useSession } from "next-auth/react";
import { useState } from "react";
import { productFormSchema, ProductVariant } from "@/lib/productValidation";
import { formatZodErrors, FormErrors } from "@/lib/formErrors";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export interface FormData {
	name: string;
	description: string;
	price: number;
	discount: number;
	tag: string;
	category: string;
	availableModel: string;
}

export const useAddProductForm = () => {
	const { data } = useSession();

	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		description: "",
		price: 800,
		discount: 0,
		tag: "NEW",
		category: "",
		availableModel: "",
	});

	const [variants, setVariants] = useState<ProductVariant[]>([
		{ color: "", stock: 0, image: null, phoneModel: "" },
	]);

	const [errors, setErrors] = useState<FormErrors>({});

	const createProduct = useMutation({
		mutationFn: async (payload: any) => {
			setIsLoading(true);
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/products`,
				payload,
				{
					headers: {
						Authorization: `Bearer ${data?.user?.token}`,
					},
				}
			);
			setIsLoading(false);
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
				availableModel: "",
			});
			setVariants([{ color: "", stock: 0, image: null, phoneModel: "" }]);
			setPreviewUrl(null);
			setErrors({});
			setIsLoading(false);
			toast.success("Product created successfully!");
		},
		onError: (err: any) => {
			console.error("Error creating product:", err);
			if (err.response?.data?.message) {
				toast.error(`Failed to create product: ${err.response.data.message}`);
			} else {
				toast.error("Failed to create product. Please try again.");
			}
			setIsLoading(false);
		},
	});

	const handleInputChange = (field: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

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

		console.log(variants);
		try {
			const validatedData = productFormSchema.parse({
				...formData,
				variants,
			});

			setErrors({});

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

			console.log("submitting payload is: ", payload);
			await createProduct.mutateAsync(payload);
		} catch (err: any) {
			if (err.name === "ZodError") {
				const formattedErrors = formatZodErrors(err);
				setErrors(formattedErrors);
				toast.error("Fill the form correctly.");
			} else {
				console.error("Error submitting product:", err);
				toast.error(
					err.message || "Something went wrong while uploading product."
				);
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
		previewUrl,
		setPreviewUrl,
	};
};
