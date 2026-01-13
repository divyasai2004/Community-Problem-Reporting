const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB(); // Admin initialization happens inside connectDB

const app = express();

app.use(cors());

// ✅ REQUIRED FOR FORM + IMAGE UPLOAD
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));

app.get("/", (req, res) => {
  res.send("Community Problem Reporting API working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
