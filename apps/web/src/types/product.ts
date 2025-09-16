export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	discount: number;
	createdAt: Date;
	updatedAt: Date;
	variants: ProductVariant[];
	reviews: Review[];
	tag: string;
}

export interface Review {
	id: string;
	message: string;
	starts: number;
	reviewer: any;
	productId: string;
	createdAt: string;
}

export interface ProductVariant {
	id: string;
	productId: string;
	color: string;
	stock: number;
	image: string;
	sku: string;
}
