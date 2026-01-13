const Complaint = require("../models/Complaint");

// ADD Complaint (with image upload support)
exports.addComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      user: req.user.id,
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      location: req.body.location,
      image: req.file ? req.file.filename : null
    });

    res.status(201).json({ message: "Complaint filed successfully", complaint });
  } catch (error) {
    console.error("Error adding complaint:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET complaints for logged-in user
exports.getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        console.error("Error fetching user complaints:", error);
        res.status(500).json({ error: error.message });
    }
};

// ADMIN — GET ALL complaints
exports.getAllComplaints = async (req, res) => {
    try {
        console.log("=== ADMIN FETCHING ALL COMPLAINTS ===");
        console.log("Admin ID:", req.user.id);
        console.log("Admin Role:", req.user.role);
        
        // Get ALL complaints without any filter - NO FILTERING AT ALL
        const complaints = await Complaint.find({})
            .populate({
                path: "user",
                select: "name email",
                // Don't fail if user doesn't exist
                strictPopulate: false
            })
            .sort({ createdAt: -1 });
        
        console.log(`✅ Found ${complaints.length} total complaints in database`);
        
        // Log each complaint with details
        complaints.forEach((c, index) => {
            const userEmail = c.user?.email || (typeof c.user === 'string' ? c.user : 'Unknown/Deleted User');
            const userId = c.user?._id || (typeof c.user === 'object' && c.user ? c.user.toString() : 'No User ID');
            console.log(`  ${index + 1}. ID: ${c._id}`);
            console.log(`     Title: ${c.title}`);
            console.log(`     User ID: ${userId}`);
            console.log(`     User Email: ${userEmail}`);
            console.log(`     Status: ${c.status || 'Pending'}`);
            console.log(`     Created: ${c.createdAt}`);
        });
        
        // Convert to plain objects and ensure user is always an object
        const formattedComplaints = complaints.map(c => {
            const complaintObj = c.toObject ? c.toObject() : c;
            return {
                ...complaintObj,
                user: complaintObj.user && typeof complaintObj.user === 'object' 
                    ? complaintObj.user 
                    : { name: "Unknown User", email: "N/A" }
            };
        });
        
        console.log(`📤 Sending ${formattedComplaints.length} complaints to admin`);
        console.log("Complaint IDs being sent:", formattedComplaints.map(c => c._id));
        
        res.json(formattedComplaints);
    } catch (error) {
        console.error("❌ Error fetching all complaints:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ error: error.message });
    }
};

// ADMIN — UPDATE complaint status
exports.updateComplaintStatus = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.json({ message: "Status updated", complaint });
    } catch (error) {
        console.error("Error updating complaint status:", error);
        res.status(500).json({ error: error.message });
    }
};
