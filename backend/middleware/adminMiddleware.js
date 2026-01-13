module.exports = (req, res, next) => {
    console.log("Admin middleware check - User role:", req.user?.role);
    if (!req.user || req.user.role !== "admin") {
        console.log("❌ Admin access denied. User role:", req.user?.role);
        return res.status(403).json({ message: "Admin access only" });
    }
    console.log("✅ Admin access granted");
    next();
};
