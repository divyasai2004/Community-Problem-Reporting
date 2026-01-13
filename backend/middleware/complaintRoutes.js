const upload = require("../middleware/uploadMiddleware");

router.post(
  "/add",
  auth,
  upload.single("image"), // 👈 ADD THIS
  addComplaint
);
