const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid =
      allowedTypes.test(file.mimetype) &&
      allowedTypes.test(path.extname(file.originalname).toLowerCase());

    cb(isValid ? null : new Error("Invalid file type"), isValid);
  }
});

module.exports = upload;
