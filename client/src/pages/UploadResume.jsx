import { useState } from "react";
import axios from "axios";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState("");
  const [resumeData, setResumeData] = useState(null);

const API_URL = "http://localhost:5000";
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setResumeData(null);
  };

  // =========================
  // Upload Resume
  // =========================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login again.");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/resume/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        res.data.message || "Resume uploaded successfully!"
      );

    } catch (err) {
      console.error("Upload Error:", err);

      setMessage(
        err.response?.data?.message ||
          "Resume upload failed."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // Extract Resume Information
  // =========================
  const handleParse = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    try {
      setParsing(true);
      setMessage("");
      setResumeData(null);

      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login again.");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/resume/parse`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResumeData(res.data.data);

      setMessage(
        res.data.message ||
          "Resume Parsed Successfully"
      );

    } catch (err) {
      console.error("Parsing Error:", err);

      setMessage(
        err.response?.data?.message ||
          "Resume parsing failed."
      );

    } finally {
      setParsing(false);
    }
  };


  return (
    <div className="container mt-5">

      <h2 className="mb-4">
        Resume Parser
      </h2>


      {/* Upload Section */}
      <div className="card p-4">

        <h4 className="mb-3">
          Upload Resume
        </h4>

        <form onSubmit={handleUpload}>

          <input
            type="file"
            className="form-control mb-3"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          <div className="d-flex gap-2">

            <button
              className="btn btn-primary"
              disabled={loading}
              type="submit"
            >
              {loading
                ? "Uploading..."
                : "Upload Resume"}
            </button>


            <button
              type="button"
              className="btn btn-success"
              disabled={parsing || !file}
              onClick={handleParse}
            >
              {parsing
                ? "Extracting..."
                : "Extract Information"}
            </button>

          </div>

        </form>


        {/* Message */}
        {message && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}

      </div>


      {/* AI Result */}
      {resumeData && (
        <div className="card p-4 mt-4">

          <h3 className="mb-4">
            Extracted Resume Information
          </h3>


          {/* Name */}
          <h5>Name</h5>
          <p>
            {resumeData.name || "Not available"}
          </p>


          {/* Email */}
          <h5>Email</h5>
          <p>
            {resumeData.email || "Not available"}
          </p>


          {/* Phone */}
          <h5>Phone</h5>
          <p>
            {resumeData.phone || "Not available"}
          </p>


          {/* Skills */}
          <h5>Skills</h5>

          {resumeData.skills?.length > 0 ? (
            <ul>
              {resumeData.skills.map(
                (skill, index) => (
                  <li key={index}>
                    {skill}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>No skills found.</p>
          )}


          {/* Education */}
          <h5>Education</h5>

          {resumeData.education?.length > 0 ? (
            resumeData.education.map(
              (edu, index) => (
                <div key={index} className="mb-3">
                  <p>
                    <strong>
                      {edu.institution}
                    </strong>
                  </p>

                  <p>
                    {edu.degree}
                  </p>

                  <p>
                    {edu.dates}
                  </p>

                  {edu.cgpa && (
                    <p>
                      CGPA: {edu.cgpa}
                    </p>
                  )}
                </div>
              )
            )
          ) : (
            <p>No education found.</p>
          )}


          {/* Experience */}
          <h5>Experience</h5>

          {resumeData.experience?.length > 0 ? (
            resumeData.experience.map(
              (exp, index) => (
                <div key={index} className="mb-3">

                  <p>
                    <strong>
                      {exp.title}
                    </strong>
                  </p>

                  <p>
                    {exp.organization}
                  </p>

                  <p>
                    {exp.description}
                  </p>

                </div>
              )
            )
          ) : (
            <p>No experience found.</p>
          )}


          {/* Projects */}
          <h5>Projects</h5>

          {resumeData.projects?.length > 0 ? (
            resumeData.projects.map(
              (project, index) => (
                <div key={index} className="mb-3">

                  <p>
                    <strong>
                      {project.title}
                    </strong>
                  </p>

                  <p>
                    {project.description}
                  </p>

                  {project.technologies?.length > 0 && (
                    <p>
                      <strong>
                        Technologies:
                      </strong>{" "}
                      {project.technologies.join(", ")}
                    </p>
                  )}

                </div>
              )
            )
          ) : (
            <p>No projects found.</p>
          )}


          {/* Certifications */}
          <h5>Certifications</h5>

          {resumeData.certifications?.length > 0 ? (
            <ul>
              {resumeData.certifications.map(
                (cert, index) => (
                  <li key={index}>
                    {cert}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>No certifications found.</p>
          )}

        </div>
      )}

    </div>
  );
};

export default UploadResume;