const familyTypeController = {};
const prisma = require("../models/prisma");

familyTypeController.getpost = async (req, res, next) => {
  //1 ของหน้าบ้านมาวาง from req

  const { params } = req.params;
  const result = await prisma.post.findMany({
    where: {
      family_name: params,
    },
  });

  console.log("resulttttttttttttttttttttttttttttt", result);
  res.status(200).json({ result });
};

module.exports = familyTypeController;
