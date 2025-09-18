export enum Tag {
	TRENDING,
	NEW,
	MOST_LIKED,
	POPULAR,
	PREMIUM,
}

export enum Category {
	SLIM_CASE,
	CLEAR_CASE,
	RUGGED_CASE,
	SILICONE_CASE,
	LEATHER_CASE,
	WOODEN_CASE,
	WALLET_CASE,
	STAND_CASE,
	MAGSAFE_COMPATIBLE,
	FLIP_CASE,
}
export enum PhoneModel {
	IPHONE_15,
	IPHONE_15_PRO,
	IPHONE_15_PRO_MAX,
	IPHONE_14,
	IPHONE_14_PRO,
	IPHONE_14_PRO_MAX,
}

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	discount: number;
	category: Category;
	phoneModel: PhoneModel;
	createdAt: Date;
	updatedAt: Date;
	variants: ProductVariant[];
	reviews: Review[];
	tag: Tag;
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
