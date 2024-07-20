const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");

const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    console.log("user.isAdmin,", user.isAdmin);
    if (!user.isAdmin) {
      createError({
        message: "You are not Admin!!!!",
        statusCode: 400,
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isAdmin;
