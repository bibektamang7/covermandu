import { Router } from "express";
import {
	getSignedUrl,
	getUser,
	loginUser,
	registerUser,
	getAllUsers,
	getUserDashboard,
} from "../controllers/user.controller";
import { authenticateUser, authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(authenticateUser, getUser);
router.route("/dashboard").get(authenticateUser, getUserDashboard);
router.route("/all").get(authenticateAdmin, getAllUsers);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/upload").get(authenticateUser, getSignedUrl);

export default router;
