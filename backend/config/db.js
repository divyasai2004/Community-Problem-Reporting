const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected Successfully");
        
        // Initialize admin user after successful connection
        const initAdmin = require("./initAdmin");
        await initAdmin();
    } catch (error) {
        console.log("DB Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
