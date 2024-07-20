const express = require("express");
const upload = require("../middlewares/upload");
const adminController = require("../controllers/admin-cointroller");
const { validateUpdateProfile } = require("../middlewares/validator");

const adminRouter = express.Router();

adminRouter.get("/getAll", adminController.getDataCard);
adminRouter.get("/getNewest", adminController.getDataNewest);
adminRouter.get("/getItem/:idcactus", adminController.getItemById);
adminRouter.patch(
  "/",
  upload.fields([
    {
      name: "profile_image",
      maxCount: 1,
    },
  ]),
  validateUpdateProfile,
  adminController.updateProfileImage
);

module.exports = adminRouter;
