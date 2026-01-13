import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ComplaintForm from "../components/ComplaintForm";
import ComplaintList from "../components/ComplaintList";
import "./Dashboard.css";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error("AUTH ERROR:", err.response?.data);
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      loadComplaints();
      // Auto-refresh complaints every 30 seconds to see status updates
      const interval = setInterval(() => {
        loadComplaints();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Manage and track your community reports</p>
        </div>
        <div className="stats-card">
          <div className="stat-item">
            <span className="stat-number">{complaints.length}</span>
            <span className="stat-label">Total Reports</span>
          </div>
        </div>
      </div>

      <ComplaintForm refresh={loadComplaints} />
      <ComplaintList complaints={complaints} />
    </div>
  );
}

export default Dashboard;
