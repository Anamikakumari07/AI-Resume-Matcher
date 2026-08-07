import { useState } from "react";
import axios from "axios";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "https://ai-resume-matcher-1-7xds.onrender.com";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/resume/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upload Resume</h2>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          className="form-control mb-3"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        <button
          className="btn btn-primary"
          disabled={loading}
          type="submit"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>

      {message && (
        <div className="alert alert-info mt-3">
          {message}
        </div>
      )}
    </div>
  );
};

export default UploadResume;