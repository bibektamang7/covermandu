"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Search, User } from "lucide-react";
import { SearchDialog } from "@/components/SearchDialog";

export const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`px-16 fixed top-0 w-full z-50 transition-all duration-300 ${
				isScrolled
					? "bg-background/95 backdrop-blur-md border-b border-border/50"
					: "bg-transparent"
			}`}
		>
			<div className="container mx-auto px-6">
				<div className="flex items-center justify-between h-16 lg:h-20">
					{/* Logo */}
					<div className="flex items-center">
						<a
							href="/"
							className="text-2xl font-bold text-gradient"
						>
							Covermandu
						</a>
					</div>

					{/* Desktop Search */}
					<div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Button
								variant="outline"
								className="w-full justify-start text-muted-foreground hover:text-foreground pl-10"
								onClick={() => setIsSearchOpen(true)}
							>
								Search for cases, accessories...
							</Button>
						</div>
					</div>

					{/* Desktop Actions */}
					<div className="hidden lg:flex items-center gap-3">
						<Button
							variant="ghost"
							size="sm"
							className="w-10 h-10 p-0 rounded-full"
							asChild
						>
							<a href="/dashboard">
								<User className="w-5 h-5" />
							</a>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="w-10 h-10 p-0 rounded-full relative"
							asChild
						>
							<a href="/cart">
								<ShoppingCart className="w-5 h-5" />
								<span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
									2
								</span>
							</a>
						</Button>
						<Button className="btn-hero">Shop Now</Button>
					</div>

					{/* Mobile Menu Button */}
					<div className="lg:hidden flex items-center gap-3">
						<Button
							variant="ghost"
							size="sm"
							className="w-10 h-10 p-0 rounded-full relative"
							asChild
						>
							<a href="/cart">
								<ShoppingCart className="w-5 h-5" />
								<span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
									2
								</span>
							</a>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="w-10 h-10 p-0"
							onClick={() => setIsOpen(!isOpen)}
						>
							{isOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="lg:hidden bg-background/95 backdrop-blur-md border-b border-border/50">
					<div className="container mx-auto px-6 py-4">
						<div className="flex flex-col space-y-4">
							<div className="flex gap-3 pt-4 border-t border-border/50">
								<Button
									variant="ghost"
									size="sm"
									className="flex-1"
									asChild
								>
									<a href="/dashboard">
										<User className="w-4 h-4 mr-2" />
										Account
									</a>
								</Button>
								<Button className="btn-hero flex-1">Shop Now</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Search Dialog */}
			<SearchDialog
				open={isSearchOpen}
				onOpenChange={setIsSearchOpen}
			/>
		</nav>
	);
};
