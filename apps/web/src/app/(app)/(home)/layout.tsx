import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="min-h-screen">
			<Navigation />
			{children}
			<Footer />
		</section>
	);
};

export default layout;
