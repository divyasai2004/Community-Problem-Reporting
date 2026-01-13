import { useState } from "react";
import API from "../services/api";
import "./ComplaintForm.css";

function ComplaintForm({ refresh }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    image: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("location", form.location);

      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await API.post("/complaints/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert(response.data.message || "Complaint submitted successfully");

      setForm({
        title: "",
        category: "",
        description: "",
        location: "",
        image: null
      });

      const fileInput = document.querySelector('.complaint-form input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }

      refresh();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to submit complaint";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <div className="complaint-form-card">
        <div className="form-header">
          <div className="form-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3>Report an Issue</h3>
          <p>Help us improve your community by reporting problems</p>
        </div>

        <form onSubmit={submitComplaint} className="complaint-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                name="title"
                placeholder="Brief title for your complaint"
                value={form.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                name="category"
                placeholder="e.g., Infrastructure, Safety, Environment"
                value={form.category}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Provide detailed description of the issue..."
              value={form.description}
              onChange={handleChange}
              className="input-field textarea-field"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              placeholder="Street address or landmark"
              value={form.location}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Image (Optional)</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="image-upload"
                className="file-input"
              />
              <label htmlFor="image-upload" className="file-label">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{form.image ? form.image.name : "Choose an image"}</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ComplaintForm;
