const express = require("express");
const upload = require("../middlewares/upload");
const userController = require("../controllers/user-controler");
const { validateUpdateProfile } = require("../middlewares/validator");

const userRouter = express.Router();

userRouter.get("/getNewest", userController.getDataNewest);
userRouter.get("/getAstrophytum", userController.getAstrophytum);
userRouter.get("/getAriocarpus", userController.getAriocarpus);
userRouter.get("/getLophophora", userController.getLophophora);
userRouter.get("/getOtherSpecies", userController.getOtherSpecies);
userRouter.get("/getAddress", userController.getAddress);
userRouter.post("/addAddress", userController.addAddress);
userRouter.patch("/addAddress/:id", userController.updateAddress);

const multerFields = [{ name: "payment_slip", maxCount: 1 }];
userRouter.post(
  "/placeOrder",
  upload.fields(multerFields),
  userController.placeOrder
);

userRouter.patch(
  "/",
  upload.fields([
    {
      name: "profile_image",
      maxCount: 1,
    },
  ]),
  validateUpdateProfile,
  userController.updateProfileImage
);

module.exports = userRouter;
