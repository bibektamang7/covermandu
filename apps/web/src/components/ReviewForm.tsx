"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

interface ReviewFormProps {
	productId: string;
	onReviewSubmitted: () => void;
}

export const ReviewForm = ({ productId, onReviewSubmitted }: ReviewFormProps) => {
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (rating === 0) {
			toast("Rating required", {
				description: "Please select a rating for your review.",
			});
			return;
		}

		if (!comment.trim()) {
			toast("Comment required", {
				description: "Please provide a comment for your review.",
			});
			return;
		}

		if (comment.length > 1000) {
			toast("Comment too long", {
				description: "Your comment must be less than 1000 characters.",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// API call to submit review
			await apiClient.post(`/products/${productId}/reviews`, {
				starts: rating,
				message: comment,
			});

			toast("Review submitted", {
				description:
					"Thank you for your feedback. Your review will appear after approval.",
			});

			// Reset form
			setRating(0);
			setComment("");
			onReviewSubmitted();
		} catch (error: any) {
			console.error("Error submitting review:", error);
			toast("Error", {
				description: error.response?.data?.message || "Failed to submit review. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<Label className="text-base font-medium text-foreground mb-3 block">
					Your Rating *
				</Label>
				<div className="flex items-center gap-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							onClick={() => setRating(star)}
							onMouseEnter={() => setRating(star)}
							className="p-1 hover:scale-110 transition-transform"
						>
							<Star
								className={`w-8 h-8 ${
									star <= rating
										? "fill-primary text-primary"
										: "text-muted-foreground hover:text-primary"
								}`}
							/>
						</button>
					))}
					{rating > 0 && (
						<span className="ml-2 text-sm text-muted-foreground">
							{rating} out of 5 stars
						</span>
					)}
				</div>
			</div>
			<div>
				<Label
					htmlFor="review-comment"
					className="text-base font-medium text-foreground"
				>
					Your Review *
				</Label>
				<Textarea
					id="review-comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="Tell others about your experience with this product. What did you like or dislike?"
					className="mt-2 min-h-[120px]"
					maxLength={1000}
				/>
				<p className="text-xs text-muted-foreground mt-1">
					{comment.length}/1000 characters
				</p>
			</div>

			<Button
				type="submit"
				disabled={isSubmitting}
				className="w-full sm:w-auto"
			>
				{isSubmitting ? "Submitting..." : "Submit Review"}
			</Button>
		</form>
	);
};

export default ReviewForm;
