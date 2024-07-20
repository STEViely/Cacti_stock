const uploadService = require("../services/upload-service");

exports.placeOrder = async (req, res, next) => {
  try {
    const paymentSlip = req.file;
    if (!paymentSlip) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadUrl = await uploadService.upload(paymentSlip.path);
    // Save the uploadUrl and other order details to the database as needed
    res.status(200).json({ message: "Order placed successfully", uploadUrl });
  } catch (error) {
    next(error);
  }
};
