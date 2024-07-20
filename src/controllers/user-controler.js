const prisma = require("../models/prisma");
const uploadService = require("../services/upload-service");
const userService = require("../services/user-service");

const userController = {};

userController.placeOrder = async (req, res, next) => {
  try {
    // Prepare order data
    const { totalPrice, user_id, postItems } = req.body; // postItems should be an array of { post_id, quantity }

    // Handle file upload if exists
    const paymentSlip =
      req.files && req.files.payment_slip ? req.files.payment_slip[0] : null;
    let paymentSlipUrl = null;

    if (paymentSlip) {
      paymentSlipUrl = await uploadService.upload(paymentSlip.path);
    }

    // Create the order
    const newOrder = await prisma.order.create({
      data: {
        totalPrice,
        user_id,
        payment_slip: paymentSlipUrl || "",
      },
    });

    // Create order items
    const orderItems = postItems.map((item) => ({
      discount: item.discount || 0, // Optional, default to 0
      order_id: newOrder.id,
      post_id: item.post_id,
    }));

    await prisma.orderitem.createMany({
      data: orderItems,
    });

    res.status(200).json({ message: "Order has been placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

// userController.placeOrder = async (req, res, next) => {
//   try {
//     let data = {
//       totalPrice: req.body.totalPrice,
//       user_id: req.body.user_id,
//     };

//     let promises = [];

//     if (req.files.payment_slip && req.files.payment_slip[0]) {
//       const result = uploadService
//         .upload(req.files.payment_slip[0].path)
//         .then((url) => ({ url, key: "payment_slip" }));
//       promises.push(result);
//     }
//     const result = await Promise.all(promises);

//     const convertData = result.reduce((acc, el) => {
//       acc[el.key] = el.url;
//       return acc;
//     }, {});

//     const combineObj = { ...data, ...convertData };
//     await userController.placeOrder(combineObj);
//     res.status(200).json({ message: "Order has been placed" });
//   } catch (error) {
//     console.log(error);
//   }
// };

userController.updateProfileImage = async (req, res, next) => {
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

userController.getDataNewest = async (req, res, next) => {
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
    console.error("Error fetching newest data:", error); // Enhanced logging
    res.status(500).json({ error: "Internal Server Error" }); // Respond with an appropriate status code and message
    next(error);
  }
};

userController.getAstrophytum = async (req, res, next) => {
  try {
    const data = await prisma.post.findMany({
      where: { family_name: "Astrophytum" },
    });
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching Astrophytum data:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

userController.getAriocarpus = async (req, res, next) => {
  try {
    const data = await prisma.post.findMany({
      where: { family_name: "Ariocarpus" },
    });
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching Ariocarpus data:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

userController.getLophophora = async (req, res, next) => {
  try {
    const data = await prisma.post.findMany({
      where: { family_name: "Lophophora" },
    });
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching Lophophora data:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

userController.getOtherSpecies = async (req, res, next) => {
  try {
    const data = await prisma.post.findMany({
      where: {
        family_name: {
          notIn: ["Astrophytum", "Ariocarpus", "Lophophora"],
        },
      },
    });
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching Other Species data:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

userController.getAddress = async (req, res, next) => {
  try {
    const data = await prisma.address.findMany({
      where: { user_id: req.user.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            mobile: true,
          },
        },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

userController.addAddress = async (req, res, next) => {
  try {
    const { firstName, lastName, mobilePhone, address, postId } = req.body;

    // Create a new address associated with the authenticated user
    const newAddress = await prisma.address.create({
      data: {
        firstName,
        lastName,
        mobilePhone,
        address,
        postId,
        user: {
          connect: { id: req.user.id }, // Connect address to the authenticated user
        },
      },
    });

    res.status(200).json(newAddress);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

userController.updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, mobilePhone, address, postId } = req.body;

    // Update the address with the specified ID
    const updatedAddress = await prisma.address.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        mobilePhone,
        address,
        postId,
      },
    });

    res.status(200).json(updatedAddress);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

module.exports = userController;
