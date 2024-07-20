const express = require("express");
const paymentController = require("../controllers/payment-controller");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { placeOrder } = require("../controllers/payment-controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/placeOrder", upload.single("paymentSlip"), placeOrder);

module.exports = router;
