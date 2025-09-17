"use client";
import { Product, ProductVariant } from "@/types/product";
import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
	variant: ProductVariant;
	product: Product;
	quantity: number;
}

interface CartContextType {
	cartItems: CartItem[];
	addToCart: (
		product: Product,
		variant: ProductVariant,
		quantity: number
	) => void;
	updateQuantity: (variantId: string, quantity: number) => void;
	removeFromCart: (variantId: string) => void;
	clearCart: () => void;
	getTotalItems: () => number;
	getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
	const [cartItems, setCartItems] = useState<CartItem[]>(() => {
		if (typeof window !== "undefined") {
			const savedCart = localStorage.getItem("cart");
			return savedCart ? JSON.parse(savedCart) : [];
		}
		return [];
	});

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("cart", JSON.stringify(cartItems));
		}
	}, [cartItems]);

	const addToCart = (
		product: Product,
		variant: ProductVariant,
		quantity: number
	) => {
		setCartItems((prevItems) => {
			const existingItem = prevItems.find(
				(item) => item.variant.id === variant.id
			);

			if (existingItem) {
				// Update quantity if item already exists
				return prevItems.map((item) =>
					item.variant.id === variant.id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			} else {
				// Add new item to cart
				return [...prevItems, { product, variant, quantity }];
			}
		});

		// TODO: Add API call to update server
		// updateCartOnServer(variant.id, quantity, "add");
	};

	const updateQuantity = (variantId: string, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(variantId);
			return;
		}

		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.variant.id === variantId ? { ...item, quantity } : item
			)
		);

		// TODO: Add API call to update server
		// updateCartOnServer(variantId, quantity, "update");
	};

	const removeFromCart = (variantId: string) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item.variant.id !== variantId)
		);

		// TODO: Add API call to update server
		// updateCartOnServer(variantId, 0, "remove");
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const getTotalItems = () => {
		return cartItems.reduce((total, item) => total + item.quantity, 0);
	};

	const getTotalPrice = () => {
		return cartItems.reduce((total, item) => {
			// Calculate discounted price
			const discountedPrice =
				item.product.price - (item.product.discount / 100) * item.product.price;
			return total + discountedPrice * item.quantity;
		}, 0);
	};

	// TODO: Implement API call to update server
	// const updateCartOnServer = async (
	// 	variantId: string,
	// 	quantity: number,
	// 	action: "add" | "update" | "remove"
	// ) => {
	// 	try {
	// 		// Example API call - adjust according to your API structure
	// 		// const response = await fetch("/api/cart", {
	// 		// 	method: "POST",
	// 		// 	headers: {
	// 		// 		"Content-Type": "application/json",
	// 		// 	},
	// 		// 	body: JSON.stringify({ variantId, quantity, action }),
	// 		// });
	// 		//
	// 		// if (!response.ok) {
	// 		// 	throw new Error("Failed to update cart on server");
	// 		// }
	// 	} catch (error) {
	// 		console.error("Error updating cart on server:", error);
	// 		// Handle error (e.g., show notification to user)
	// 	}
	// };

	const value = {
		cartItems,
		addToCart,
		updateQuantity,
		removeFromCart,
		clearCart,
		getTotalItems,
		getTotalPrice,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
