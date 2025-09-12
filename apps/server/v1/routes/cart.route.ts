import { Router } from "express";
import {
	addToCart,
	deleteCartItem,
	getCartItems,
	updateCartItem,
} from "../controllers/cart.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateUser);

router.route("/").post(addToCart).get(getCartItems);
router.route("/:cartId").put(updateCartItem).delete(deleteCartItem);

export default router;
