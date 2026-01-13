const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    image: String,
    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true } // ✅ VERY IMPORTANT
);

module.exports = mongoose.model("Complaint", complaintSchema);
