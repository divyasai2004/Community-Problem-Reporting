const express = require("express");
const { addComplaint, getUserComplaints, getAllComplaints, updateComplaintStatus } = require("../controllers/complaintController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// User routes
router.post("/add", auth, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, addComplaint);
router.get("/my", auth, getUserComplaints);

// Admin route
router.get("/all", auth, admin, getAllComplaints);
router.put("/status/:id", auth, admin, updateComplaintStatus);

module.exports = router;
