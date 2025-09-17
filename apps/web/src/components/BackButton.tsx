"use client"
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
	const router = useRouter();
	return (
		<Button
			variant="ghost"
			onClick={() => router.back()}
			className="mb-6 hover:cursor-pointer"
		>
			<ArrowLeft className="w-4 h-4 mr-2" />
			Back
		</Button>
	);
};

export default BackButton;
