import { Router } from "express";
import {
	createProduct,
	deleteProduct,
	getProducts,
	getProductById,
	updateProduct,
} from "../controllers/product.controller";
import {
	authenticateAdmin,
	authenticateUser,
} from "../middlewares/auth.middleware";

const router = Router();

router
	.route("/")
	.post(authenticateAdmin, createProduct)
	.get(getProducts);
router
	.route("/:productId")
	.put(authenticateAdmin, updateProduct)
	.delete(authenticateAdmin, deleteProduct)
	.get(getProductById);

export default router;
