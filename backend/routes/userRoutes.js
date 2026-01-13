const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin route - Get all users
router.get("/all", auth, admin, getAllUsers);

module.exports = router;
