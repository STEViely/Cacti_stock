const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    console.log(authorization);
    if (!authorization || !authorization.startsWith("Bearer ")) {
      createError({
        message: "unauthenticated",
        statusCode: 401,
      });
    }

    const accessToken = authorization.split(" ")[1];
    const payload = jwtService.verify(accessToken);
    console.log("payload", payload);
    const user = await userService.findUserById(payload.id);
    console.log("user", user);
    if (!user) {
      createError({
        message: "user was not found",
        statusCode: 400,
      });
    }

    delete user.password;

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
