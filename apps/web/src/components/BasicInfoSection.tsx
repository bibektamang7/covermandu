import { categories, phoneModels, availableModels } from "@/lib/constants";
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
import { FormErrors } from "@/lib/formErrors";
import { FormData } from "@/hooks/useAddProductForm";

interface BasicInfoSectionProps {
	formData: FormData;
	onInputChange: (field: string, value: string | number) => void;
	errors: FormErrors;
}

export function BasicInfoSection({
	formData,
	onInputChange,
	errors,
}: BasicInfoSectionProps) {
	return (
		<div className="grid lg:grid-cols-2 lg:gap-8">
			<div className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="name">Product Name *</Label>
					<Input
						id="name"
						value={formData.name}
						onChange={(e) => onInputChange("name", e.target.value)}
						placeholder="iPhone 15 Pro Max Case"
					/>
					{errors.name && (
						<p className="text-sm text-destructive">{errors.name}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description *</Label>
					<Textarea
						id="description"
						value={formData.description}
						onChange={(e) => onInputChange("description", e.target.value)}
						placeholder="Describe your product..."
						rows={4}
					/>
					{errors.description && (
						<p className="text-sm text-destructive">{errors.description}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="tag">Product Tag *</Label>
					<Select
						value={formData.tag}
						onValueChange={(value) => onInputChange("tag", value)}
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
					{errors.tag && (
						<p className="text-sm text-destructive">{errors.tag}</p>
					)}
				</div>
			</div>

			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="price">Price (Rs.) *</Label>
						<Input
							id="price"
							type="number"
							step="0.01"
							value={formData.price}
							onChange={(e) => onInputChange("price", Number(e.target.value))}
							placeholder="2999.00"
						/>
						{errors.price && (
							<p className="text-sm text-destructive">{errors.price}</p>
						)}
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
								onInputChange("discount", Number(e.target.value))
							}
							placeholder="10"
						/>
						{errors.discount && (
							<p className="text-sm text-destructive">{errors.discount}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="category">Category *</Label>
					<Select
						value={formData.category}
						onValueChange={(value) => onInputChange("category", value)}
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
					{errors.category && (
						<p className="text-sm text-destructive">{errors.category}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="availableModel">Available Model *</Label>
					<Select
						value={formData.availableModel}
						onValueChange={(value) => onInputChange("availableModel", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select available model" />
						</SelectTrigger>
						<SelectContent>
							{availableModels.map((availableModel) => (
								<SelectItem
									key={availableModel}
									value={availableModel}
								>
									{availableModel.replaceAll("_", " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.availableModel && (
						<p className="text-sm text-destructive">{errors.availableModel}</p>
					)}
				</div>
			</div>
		</div>
	);
}
