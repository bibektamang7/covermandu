import express from "express";

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json({ limit: "15kb" }));


import cartRoutes from "./v1/routes/cart.route";
import productRoutes from "./v1/routes/product.route";
import reviewRoutes from "./v1/routes/review.route";
import userRoutes from "./v1/routes/user.route";
import wishlistRoutes from "./v1/routes/wishlist.route";

app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/wishlists", wishlistRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log("Server is running on port", port);
});
