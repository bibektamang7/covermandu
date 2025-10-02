import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductVariant } from "@/lib/productValidation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { phoneModels } from "@/lib/constants";
import { FormErrors } from "@/lib/formErrors";
import { FormData } from "./BasicInfoSection";

interface ProductVariantItemProps {
	variant: ProductVariant;
	index: number;
	onVariantChange: (
		index: number,
		field: keyof ProductVariant,
		value: any
	) => void;
	onRemove: (index: number) => void;
	errors: FormErrors;
	onInputChange: (field: string, value: string | number) => void;
	formData: FormData;
}

export function ProductVariantItem({
	variant,
	index,
	onVariantChange,
	onRemove,
	errors,
	onInputChange,
	formData,
}: ProductVariantItemProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		onVariantChange(index, "image", file);

		// Create preview URL
		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		} else {
			setPreviewUrl(null);
		}
	};

	const removeImage = () => {
		onVariantChange(index, "image", null);
		setPreviewUrl(null);
	};

	return (
		<div className="border rounded-lg p-4 space-y-4">
			<div className="flex items-center justify-between">
				<h4 className="font-medium">Variant {index + 1}</h4>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => onRemove(index)}
					className="text-destructive hover:text-destructive"
				>
					<X className="w-4 h-4" />
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor={`color-${index}`}>Color *</Label>
					<Input
						id={`color-${index}`}
						value={variant.color}
						onChange={(e) => onVariantChange(index, "color", e.target.value)}
						placeholder="e.g., Blue, Red, Black"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor={`stock-${index}`}>Stock *</Label>
					<Input
						id={`stock-${index}`}
						type="number"
						value={variant.stock}
						onChange={(e) =>
							onVariantChange(index, "stock", Number(e.target.value))
						}
						placeholder="50"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="phoneModel">Phone Model *</Label>
					<Select
						value={formData.phoneModel}
						onValueChange={(value) =>
							onVariantChange(index, "phoneModel", value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select phone model" />
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
					{errors.phoneModel && (
						<p className="text-sm text-destructive">{errors.phoneModel}</p>
					)}
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
										onChange={handleImageUpload}
										className="hidden"
									/>
								</div>
							</div>
						</div>
					</div>

					{(previewUrl || variant.image) && (
						<div className="relative">
							<img
								src={
									previewUrl ||
									(variant.image ? URL.createObjectURL(variant.image) : "")
								}
								alt={`${variant.color} variant`}
								className="w-20 h-20 object-cover rounded-lg border"
							/>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								className="absolute -top-2 -right-2 h-6 w-6 p-0"
								onClick={removeImage}
							>
								<X className="h-3 w-3" />
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
