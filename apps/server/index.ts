import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));
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

// import { prisma } from "db";
// const email = process.env.ADMIN_EMAIL!;
// const googleId = `google-jdk7ihoj`;

// async function createAdmin() {
// 	console.log("called");
// 	try {
// 		// const userCreated = await prisma.user.create({
// 		// 	data: {
// 		// 		email,
// 		// 		googleId,
// 		// 		image:
// 		// 			"https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
// 		// 		name: "Bibek Tamang",
// 		// 		role: "ADMIN",
// 		// 	},
// 		// });
// 		const user = await prisma.user.findUnique({
// 			where: {
// 				email,
// 				googleId,
// 			},
// 		});
// 		// console.log("created user", userCreated);
// 		console.log("this is user", user);
// 	} catch (error) {
// 		console.error("waht happend", error);
// 	}
// }

// createAdmin();
