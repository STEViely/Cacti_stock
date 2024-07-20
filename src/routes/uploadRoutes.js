const express = require("express");
const fs = require("fs");
const path = require("path");
const uploadService = require("../services/upload-service"); // Adjust path if necessary
const upload = require("../middlewares/upload"); // Adjust path if necessary

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = path.join("uploads", req.file.filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      const fileUrl = await uploadService.upload(filePath);

      // Remove file after upload
      fs.unlinkSync(filePath);

      res.status(200).json({ secure_url: fileUrl });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading file" });
  }
});

module.exports = router;
