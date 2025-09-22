"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Login = () => {
	const [isLogin, setIsLogin] = useState(true);
	const router = useRouter();
	const handleAuth = async () => {
		try {
			await signIn("google", { redirectTo: "/dashboard" });
		} catch (error) {
			console.error("Failed to authenticate", error);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
			<div className="h-screen flex flex-col items-start justify-center px-6">
				<div
					onClick={() => {
						router.back();
					}}
					className="lg:pl-20 flex items-center hover:cursor-pointer hover:text-primary "
				>
					<ChevronLeft />
					<span className="font-bold">back</span>
				</div>
				<div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] lg:w-[80%] lg:mx-auto">
					<div className="flex items-center justify-center">
						<Card className="w-full max-w-md shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
							<CardHeader className="space-y-1 text-center">
								<CardTitle className="text-2xl font-bold">
									{isLogin ? "Welcome Back" : "Create Account"}
								</CardTitle>
								<CardDescription>
									{isLogin
										? "Sign in to your account to continue"
										: "Join us and start your journey today"}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button
									onClick={handleAuth}
									variant="outline"
									className="hover:cursor-pointer w-full h-12 text-base font-medium hover:bg-accent/50 border-2"
								>
									<svg
										className="mr-2 h-5 w-5"
										viewBox="0 0 24 24"
									>
										<path
											fill="#4285F4"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="#34A853"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="#FBBC05"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="#EA4335"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
									Continue with Google
								</Button>

								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<Separator className="w-full" />
									</div>
								</div>

								<div className="text-center text-sm text-muted-foreground">
									{isLogin
										? "Don't have an account? "
										: "Already have an account? "}
									<Button
										variant="link"
										className="hover:cursor-pointer p-0 h-auto text-sm font-medium text-primary"
										onClick={() => setIsLogin(!isLogin)}
									>
										{isLogin ? "Sign up" : "Sign in"}
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="hidden lg:flex items-center justify-center">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl" />
							<img
								src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
								alt="Modern workspace with phone and accessories"
								className="rounded-3xl shadow-2xl w-full max-w-lg object-cover h-[500px]"
							/>
							<div className="absolute bottom-8 left-8 right-8 text-white">
								<h3 className="text-2xl font-bold mb-2">
									Premium Phone Cases & Accessories
								</h3>
								<p className="text-white/90">
									Protect your device with style. Join thousands of satisfied
									customers.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
