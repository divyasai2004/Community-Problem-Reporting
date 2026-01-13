import "./ComplaintList.css";

function ComplaintList({ complaints }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "#10b981";
      case "In Progress":
        return "#3b82f6";
      default:
        return "#f59e0b";
    }
  };

  return (
    <div className="complaint-list-container">
      <h2 className="section-title">My Complaints</h2>

      {!complaints || complaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No complaints submitted yet.</p>
          <p className="empty-subtitle">Start reporting issues to see them here</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((c) => (
            <div key={c._id} className="complaint-card">
              <div className="complaint-header">
                <h3>{c.title}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: `${getStatusColor(c.status)}20`, color: getStatusColor(c.status) }}
                >
                  {c.status}
                </span>
              </div>

              <div className="complaint-body">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComplaintList;
