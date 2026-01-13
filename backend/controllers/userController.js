const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -------------------- REGISTER USER --------------------
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        let userExists = await User.findOne({ email });
        if (userExists) return res.json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            address
        });

        // Remove password before sending user data
        const { password: pwd, ...safeUser } = user._doc;

        res.json({ 
            message: "Registration successful", 
            user: safeUser 
        });

    } catch (error) {
        res.json({ error: error.message });
    }
};

// -------------------- LOGIN USER --------------------
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        // Remove password before responding
        const { password: pwd, ...safeUser } = user._doc;

        console.log(`User logged in: ${email}, Role: ${user.role}`);

        res.json({
            message: "Login successful",
            token,
            user: safeUser
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
};

// -------------------- GET ALL USERS (ADMIN ONLY) --------------------
exports.getAllUsers = async (req, res) => {
    try {
        console.log("=== ADMIN FETCHING ALL USERS ===");
        console.log("Admin ID:", req.user.id);
        console.log("Admin Role:", req.user.role);
        
        // Get ALL users including admin, exclude password
        const users = await User.find({}, { password: 0 })
            .sort({ createdAt: -1 });
        
        console.log(`✅ Found ${users.length} total users in database`);
        
        // Log each user
        users.forEach((u, index) => {
            console.log(`  ${index + 1}. Name: ${u.name || 'No Name'}, Email: ${u.email}, Role: ${u.role || 'user'}, Created: ${u.createdAt}`);
        });
        
        console.log(`📤 Sending ${users.length} users to admin`);
        
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching all users:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ error: error.message });
    }
};
