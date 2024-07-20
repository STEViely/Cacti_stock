const prisma = require("../models/prisma");
const postService = require("../services/post-service");
const uploadService = require("../services/upload-service");

const postController = {};

postController.createPost = async (req, res, next) => {
  try {
    let data = {
      diameter: req.body.diameter,
      price: req.body.price,
      height: req.body.height || null,
      describtion: req.body.describtion || null,
      family_name: req.body.family_name,
      name: req.body.name,
      born: req.body.born,
      idcactus: req.body.idcactus,
      postByUser_id: req.user.id,
    };

    let promises = [];

    if (req.files.front_side[0]) {
      const result = uploadService
        .upload(req.files.front_side[0].path)
        .then((url) => ({ url, key: "front_side" }));
      promises.push(result);
    }
    if (req.files.A_side[0]) {
      const result = uploadService
        .upload(req.files.A_side[0].path)
        .then((url) => ({ url, key: "A_side" }));
      promises.push(result);
    }
    if (req.files.B_side[0]) {
      const result = uploadService
        .upload(req.files.B_side[0].path)
        .then((url) => ({ url, key: "B_side" }));
      promises.push(result);
    }
    if (req.files.C_side[0]) {
      const result = uploadService
        .upload(req.files.C_side[0].path)
        .then((url) => ({ url, key: "C_side" }));
      promises.push(result);
    }

    const result = await Promise.all(promises);

    const convertData = result.reduce((acc, el) => {
      acc[el.key] = el.url;
      return acc;
    }, {});

    const combineObj = { ...data, ...convertData };
    await postService.createPost(combineObj);
    res.status(200).json({ message: "create post successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = postController;
