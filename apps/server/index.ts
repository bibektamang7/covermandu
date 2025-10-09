import express from "express";
import cors from "cors";
import "./v1/utils/instrument";
import { errorHandler, notFound } from "./v1/utils/errorHandler";

const app = express();

app.use(
	cors({
		origin: ["http://localhost:3000"],
		methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
		credentials: true,
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "15kb" }));
app.set("trust proxy", 1);

app.use(globalRateLimiterMiddleware);

import cartRoutes from "./v1/routes/cart.route";
import productRoutes from "./v1/routes/product.route";
import reviewRoutes from "./v1/routes/review.route";
import userRoutes from "./v1/routes/user.route";
import wishlistRoutes from "./v1/routes/wishlist.route";
import { globalRateLimiterMiddleware } from "./v1/utils/rateLimiter";

app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/wishlists", wishlistRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log("Server is running on port", port);
});
