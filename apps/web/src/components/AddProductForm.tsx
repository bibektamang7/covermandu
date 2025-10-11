"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { ProductVariantItem } from "@/components/ProductVariantItem";
import { BasicInfoSection } from "@/components/BasicInfoSection";
import { useAddProductForm } from "@/hooks/useAddProductForm";

const AddProductForm = () => {
	const {
		handleInputChange,
		addVariant,
		handleSubmit,
		handleVariantChange,
		removeVariant,
		formData,
		createProduct,
		errors,
		variants,
		previewUrl,
		setPreviewUrl,
	} = useAddProductForm();
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
								onRemove={removeVariant}
								errors={errors}
								previewUrl={previewUrl}
								setPreviewUrl={setPreviewUrl}
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
