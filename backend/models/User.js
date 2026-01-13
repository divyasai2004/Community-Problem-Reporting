const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    address: String,
    role: { type: String, default: "user" }  // user or admin
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", userSchema);
