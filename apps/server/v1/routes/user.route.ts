import { Router } from "express";
import {
	getSignedUrl,
	getUser,
	loginUser,
	registerUser,
} from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(authenticateUser, getUser);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/upload").get(authenticateUser, getSignedUrl);

export default router;
