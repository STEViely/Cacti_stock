const prisma = require("../models/prisma");

const cartController = {};

cartController.addToCart = async (req, res, next) => {
  try {
    const data = req.body;
    const isItem = await prisma.cart.findFirst({
      where: {
        user_id: req.body.user_id,
        post_id: req.body.post_id,
      },
    });
    if (isItem) {
      return res
        .status(300)
        .json({ message: "You have already added this item" });
    }
    const result = await prisma.cart.create({ data });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

cartController.removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.cart.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
};

cartController.getAllItem = async (req, res, next) => {
  try {
    const data = await prisma.cart.findMany({
      where: { user_id: req.user.id },
      include: { post: true },
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = cartController;
