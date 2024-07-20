const express = require("express");
const cartController = require("../controllers/cart-controller");

const cartRouter = express.Router();

cartRouter.get("/getAllItem", cartController.getAllItem);
cartRouter.post("/addToCart", cartController.addToCart);
cartRouter.delete("/delete/:id", cartController.removeFromCart);

module.exports = cartRouter;
