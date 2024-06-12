const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");

const authController = {};

authController.register = async (req, res, next) => {
  try {
    const data = req.input;
    const exitsUser = await userService.findUserByEmailOrMobile(
      data.email || data.mobile
    );

    if (exitsUser) {
      createError({
        message: "email or mobile already in used",
        field: "email or mobile already in use",
        statusCode: 400,
      });
    }
    data.password = await hashService.hash(data.password);
    await userService.createUser(data);
    res.status(201).json({ message: "user created" });
  } catch (err) {
    next(err);
  }
};

authController.login = async (req, res, next) => {
  try {
    const existUser = await userService.findUserByEmailOrMobile(
      req.input.emailOrMobile
    );
    if (!existUser) {
      createError({
        message: "Email/Mobile or password is not correct",
        statusCode: 400,
      });
    }
    const isMatch = await hashService.compare(
      req.input.password,
      existUser.password
    );

    if (!isMatch) {
      createError({
        message: "Email/Mobile or password is not correct",
        statusCode: 400,
      });
    }
    const accessToken = jwtService.sign({
      id: existUser.id,
      isAdmin: existUser.isAdmin,
    });
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

authController.getMe = (req, res, next) => {
  res.status(200).json({ user: req.user });
};

module.exports = authController;
