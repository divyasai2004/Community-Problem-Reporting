import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("complaints"); // "complaints" or "users"
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (role !== "admin") {
      alert("Access denied. Admin only.");
      navigate("/dashboard");
      return;
    }

    loadComplaints();
    loadUsers();
  }, []);

  const loadComplaints = async () => {
    try {
      console.log("🔄 Loading complaints for admin...");
      const res = await API.get("/complaints/all");
      
      console.log("📥 Raw API response:", res);
      console.log("📥 Response data:", res.data);
      console.log("📥 Response data type:", typeof res.data);
      console.log("📥 Is array?", Array.isArray(res.data));

      let data = [];
      
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.complaints)) {
        data = res.data.complaints;
      } else if (res.data && typeof res.data === 'object') {
        // If it's an object, try to extract complaints
        data = Object.values(res.data).filter(item => Array.isArray(item)).flat();
        if (data.length === 0) {
          data = [res.data];
        }
      }

      console.log(`✅ Processed ${data.length} complaints for display`);
      console.log("Complaints details:", data.map(c => ({
        id: c._id,
        title: c.title,
        user: c.user?.email || c.user || 'Unknown',
        status: c.status
      })));

      setComplaints(data);
    } catch (err) {
      console.error("❌ Error loading complaints:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Access denied. Please login as admin.");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        navigate("/");
      } else {
        alert(`Error loading complaints: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      console.log("🔄 Loading users for admin...");
      const res = await API.get("/users/all");
      
      console.log("📥 Users API response:", res);
      console.log("📥 Users data:", res.data);
      console.log("📥 Is array?", Array.isArray(res.data));
      
      const usersData = Array.isArray(res.data) ? res.data : [];
      console.log(`✅ Loaded ${usersData.length} users`);
      console.log("Users list:", usersData.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));
      
      setUsers(usersData);
    } catch (err) {
      console.error("❌ Error loading users:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Access denied. Please login as admin.");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        navigate("/");
      } else {
        alert(`Error loading users: ${err.response?.data?.message || err.message}`);
      }
      setUsers([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/complaints/status/${id}`, { status });
      alert("Status updated successfully!");
      loadComplaints(); // Reload to show updated status
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const getStatusCounts = () => {
    const counts = { Pending: 0, "In Progress": 0, Resolved: 0 };
    complaints.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage users and community reports</p>
        </div>
        <div className="admin-stats">
          <div className="stat-card stat-pending">
            <span className="stat-number">{statusCounts.Pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card stat-progress">
            <span className="stat-number">{statusCounts["In Progress"]}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card stat-resolved">
            <span className="stat-number">{statusCounts.Resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "complaints" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("complaints");
            loadComplaints(); // Refresh when switching to complaints tab
          }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Complaints ({complaints.length})
        </button>
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("users");
            loadUsers(); // Refresh when switching to users tab
          }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users ({users.length})
        </button>
      </div>

      {/* Users Tab Content */}
      {activeTab === "users" && (
        <div className="users-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 className="section-title">Registered Users</h2>
            <button 
              onClick={loadUsers} 
              className="btn-primary"
              style={{ padding: "10px 20px", fontSize: "14px" }}
            >
              🔄 Refresh
            </button>
          </div>
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>No users registered yet.</p>
              <p className="empty-subtitle">Users will appear here once they register</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-header">
                    <div className="user-avatar">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="user-info">
                      <h3>{user.name || "No Name"}</h3>
                      <p className="user-email">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <span className="role-badge admin-badge">Admin</span>
                    )}
                  </div>
                  <div className="user-details">
                    <div className="detail-item">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Role: {user.role || "user"}</span>
                    </div>
                    {user.address && (
                      <div className="detail-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{user.address}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Complaints Tab Content */}
      {activeTab === "complaints" && (

        <>
          {!Array.isArray(complaints) || complaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>No complaints found.</p>
            </div>
          ) : (
            <div className="admin-complaints-grid">
              {complaints.map((c) => (
                <div key={c._id} className="admin-complaint-card">
                  <div className="complaint-header">
                    <h3>{c.title}</h3>
                    <span className={`status-badge status-${c.status?.replace(" ", "-").toLowerCase() || "pending"}`}>
                      {c.status || "Pending"}
                    </span>
                  </div>

                  <p className="complaint-description">{c.description}</p>

                  <div className="complaint-details">
                    <div className="detail-item">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{c.category}</span>
                    </div>

                    <div className="detail-item">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{c.location}</span>
                    </div>

                    <div className="detail-item">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{c.user?.email || "Unknown"}</span>
                    </div>

                    <div className="detail-item">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {c.image && (
                    <div className="complaint-image">
                      <img
                        src={`http://localhost:5000/uploads/${c.image}`}
                        alt="Complaint"
                      />
                    </div>
                  )}

                  <div className="status-update">
                    <label>Update Status:</label>
                    <select
                      value={c.status || "Pending"}
                      onChange={(e) => updateStatus(c._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
