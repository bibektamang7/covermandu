import { Router } from "express";
import {
	createReview,
	getReviewsByProduct,
	getUserReviews,
} from "../controllers/review.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router
	.route("/")
	.post(authenticateUser, createReview)
	.get(authenticateUser, getUserReviews);
router.route("/product/:productId").get(getReviewsByProduct);

export default router;
