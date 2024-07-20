const fs = require("fs/promises");

const uploadService = require("../services/upload-service");
const userService = require("../services/user-service");
const prisma = require("../models/prisma");

const adminController = {};

adminController.updateProfileImage = async (req, res, next) => {
  try {
    const promises = [];
    if (req.files.profile_image) {
      const result = uploadService
        .upload(req.files.profile_image[0].path)
        .then((url) => ({ url, key: "profile_image" }));
      promises.push(result);
    }

    const result = await Promise.all(promises);

    const data = result.reduce((acc, el) => {
      acc[el.key] = el.url;
      return acc;
    }, {});

    await userService.updateUserById(data, req.user.id);
    res.status(200).json(data);
    res.json("Endddd");
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profile_image) {
      fs.unlink(req.files.profile_image[0].path);
    }
  }
};

adminController.getDataCard = async (req, res, next) => {
  try {
    const data = await prisma.post.findMany({
      orderBy: { create_time: "desc" },
    });
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    next(error);
  }
};

adminController.getDataNewest = async (req, res, next) => {
  try {
    const data = await prisma.post.findMany({
      orderBy: {
        create_time: "desc",
      },
      take: 50,
    });
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    next(error);
  }
};

adminController.getItemById = async (req, res, next) => {
  const { idcactus } = req.params;
  console.log(`Fetching item with idcactus: ${idcactus}`); // Logging the request

  try {
    const data = await prisma.post.findFirst({
      where: { idcactus }, // Ensure to treat `idcactus` as a string
    });

    if (!data) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching item with idcactus: ${idcactus}`, error); // Add error logging
    next(error);
  }
};

module.exports = adminController;
