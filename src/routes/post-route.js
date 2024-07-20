const express = require("express");
const upload = require("../middlewares/upload");

const postController = require("../controllers/post-controler");

console.log(postController); // Add this line

const postRouter = express.Router();

const multerFields = [
  { name: "front_side", maxCount: 1 },
  { name: "A_side", maxCount: 1 },
  { name: "B_side", maxCount: 1 },
  { name: "C_side", maxCount: 1 },
];

postRouter.post(
  "/createPost",
  upload.fields(multerFields),
  postController.createPost
);

module.exports = postRouter;
