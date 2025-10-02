"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import RecommendedProducts from "@/pages/RecommendedProducts";

const Cart = () => {
	const {
		cartItems,
		updateQuantity,
		removeFromCart,
		getTotalItems,
		getTotalPrice,
	} = useCart();

	const subtotal = getTotalPrice();
	const shipping = cartItems.length > 0 ? 150 : 0;
	const total = subtotal + shipping;

	return (
		<div className="pt-12 px-16">
			<div className="pt-8 pb-4 border-b border-border px-4">
				<div className="mx-auto">
					<h1 className="text-2xl font-bold">Shopping Cart</h1>
				</div>
			</div>

			<div className="mx-auto pb-8 px-4">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<div className="space-y-4">
							{cartItems.length === 0 ? (
								<Card>
									<CardContent className="p-12 text-center">
										<div className="w-24 h-24 mx-auto mb-6">
											<img
												src="/empty-cart.png"
												alt="Empty cart"
												className="w-full h-full object-contain opacity-60"
											/>
										</div>
										<h3 className="text-xl font-semibold mb-2">
											Your cart is empty
										</h3>
										<p className="text-muted-foreground mb-6">
											Add some products to your cart
										</p>
										<Link href="/products">
											<Button className="hover:cursor-pointer">
												Continue Shopping
											</Button>
										</Link>
									</CardContent>
								</Card>
							) : (
								cartItems.map((item) => {
									// Calculate discounted price
									const discountedPrice =
										item.product.price -
										(item.product.discount / 100) * item.product.price;
									const itemTotal = discountedPrice * item.quantity;

									return (
										<Card key={item.variant.id}>
											<CardContent className="p-6">
												<div className="flex items-center gap-4">
													<div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
														<img
															src={item.variant.image}
															alt={item.variant.color}
															className="w-full h-full object-cover"
														/>
													</div>

													<div className="flex-1">
														<h3 className="font-semibold">
															{item.product.name}
														</h3>
														<p className="text-sm text-muted-foreground mt-1">
															Variant: {item.variant.color}
														</p>
														<p className="text-lg font-bold text-primary mt-2">
															Rs. {itemTotal.toLocaleString()}
														</p>
													</div>

													<div className="flex items-center gap-2">
														<Button
															variant="outline"
															size="sm"
															className="w-8 h-8 p-0"
															onClick={() =>
																updateQuantity(
																	item.variant.id,
																	item.quantity - 1
																)
															}
														>
															<Minus className="w-4 h-4" />
														</Button>
														<span className="w-8 text-center font-medium">
															{item.quantity}
														</span>
														<Button
															variant="outline"
															size="sm"
															className="w-8 h-8 p-0"
															onClick={() =>
																updateQuantity(
																	item.variant.id,
																	item.quantity + 1
																)
															}
														>
															<Plus className="w-4 h-4" />
														</Button>
													</div>

													<Button
														variant="ghost"
														size="sm"
														className="text-destructive hover:text-destructive"
														onClick={() => removeFromCart(item.variant.id)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</CardContent>
										</Card>
									);
								})
							)}
						</div>

						<div className="mt-8">
							<Link href="/products">
								<Button
									variant="outline"
									className="w-full sm:w-auto"
								>
									<ShoppingBag className="w-4 h-4 mr-2" />
									Continue Shopping
								</Button>
							</Link>
						</div>
					</div>

					<div className="lg:col-span-1">
						<Card className="sticky top-24">
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>Rs. {subtotal.toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span>Shipping</span>
									<span>Rs. {shipping}</span>
								</div>
								<Separator />
								<div className="flex justify-between text-lg font-bold">
									<span>Total</span>
									<span className="text-primary">
										Rs. {total.toLocaleString()}
									</span>
								</div>

								<div className="space-y-3 mt-6">
									<Button
										className="w-full btn-hero"
										size="lg"
										disabled={cartItems.length === 0}
									>
										Proceed to Checkout
									</Button>
									<Button
										variant="outline"
										className="w-full"
									>
										Save for Later
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			<RecommendedProducts />
		</div>
	);
};

export default Cart;
