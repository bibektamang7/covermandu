import { Router } from "express";
import {
	addToWishList,
	deleteWishlistItem,
	getWishlist,
} from "../controllers/wishlist.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateUser);

router.route("/").post(addToWishList).get(getWishlist);
router.route("/:id").delete(deleteWishlistItem);

export default router;
