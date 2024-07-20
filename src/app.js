require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/not-found");
const limiter = require("./middlewares/rate-limit");
const authRouter = require("./routes/auth-route");
const userRouter = require("./routes/user-route");
const authenticate = require("./middlewares/authenticate");
const familyTypeRouter = require("./routes/family-routh");
const postRouter = require("./routes/post-route");
const isAdmin = require("./middlewares/isAdmin");
const adminRouter = require("./routes/admin-route");
const cartRouter = require("./routes/cart-route");
const paymentRoutes = require("./routes/payment-route");
const uploadRoutes = require("./routes/uploadRoutes");
const uploadRoute = require("./routes/uploadRoutes"); // Adjust path if necessary

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", uploadRoute);

app.use("/auth", authRouter);
app.use("/user", authenticate, userRouter);
app.use("/admin", authenticate, adminRouter);
app.use("/familyType", familyTypeRouter);
app.use("/posts", authenticate, isAdmin, postRouter);
app.use("/cart", authenticate, cartRouter);
app.use("/payment", paymentRoutes);
app.use("/upload", uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 8220;
app.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
