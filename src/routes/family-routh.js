const express = require("express");
const familyTypeController = require("../controllers/familytype-controller");

const familyTypeRouter = express.Router();

familyTypeRouter.get("/:id", familyTypeController.getpost);

module.exports = familyTypeRouter;
