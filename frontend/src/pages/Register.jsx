import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("student");

  // Student fields
  const [rollNo, setRollNo] = useState("");
  const [semester, setSemester] = useState("1");
  const [year, setYear] = useState("1");

  // Teacher fields
  const [teacherId, setTeacherId] = useState("");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [subjectsTaught, setSubjectsTaught] = useState("");

  // Staff fields
  const [staffId, setStaffId] = useState("");
  const [staffType, setStaffType] = useState("general");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const passwordIssues = (() => {
    const issues = [];
    if (!password) return ["Password is required"];
    if (password.length < 8) issues.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) issues.push("At least one uppercase letter");
    if (!/[a-z]/.test(password)) issues.push("At least one lowercase letter");
    if (!/[0-9]/.test(password)) issues.push("At least one number");
    if (!/[^A-Za-z0-9]/.test(password))
      issues.push("At least one special character");
    return issues;
  })();
  const isStrongPassword = passwordIssues.length === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!isStrongPassword) {
      setError(
        "Please choose a stronger password that meets the requirements."
      );
      return;
    }

    try {
      const payload = { name, email, password, phone, department, role };

      if (role === "student") {
        payload.rollNo = rollNo;
        payload.semester = parseInt(semester);
        payload.year = parseInt(year);
      } else if (role === "teacher") {
        payload.teacherId = teacherId;
        payload.designation = designation;
        payload.subjectsTaught = subjectsTaught
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
      } else if (role === "staff") {
        payload.staffId = staffId;
        payload.staffType = staffType;
      }

      await api.post("/auth/register", payload);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="row justify-content-center align-items-center py-5">
      <div className="col-md-8 col-lg-6">
        <div
          className="card shadow-lg p-4 border-0"
          style={{ borderRadius: 16 }}
        >
          <div className="text-center mb-4">
            <img
              src={theme === "dark" ? "/dark.png" : "/light.png"}
              alt="CampusHive"
              height="80"
              className="mb-3"
            />
            <h2 className="text-warning">Join CampusHive</h2>
            <p className="text-muted">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name *</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Auto-capitalize first letter of each word
                    const capitalized = value
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ");
                    setName(capitalized);
                  }}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email *</label>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Password *</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <small className="text-muted d-block mt-1">
                  Password must be 8+ chars with upper, lower, number, and
                  special symbol.
                </small>
                {!isStrongPassword && (
                  <small className="text-danger d-block mt-1">
                    Missing: {passwordIssues.join(", ")}
                  </small>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone</label>
                <input
                  className="form-control"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-3">
              <label className="form-label fw-semibold">I am a *</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff Member</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Department *</label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Administration">Administration</option>
                <option value="Library">Library</option>
              </select>
            </div>

            {/* Student-specific fields */}
            {role === "student" && (
              <>
                <div className="alert alert-info">
                  <small>
                    Student account gives you access to clubs, events, attendance tracking, and academic resources.
                  </small>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      Roll Number *
                    </label>
                    <input
                      className="form-control"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      required
                      placeholder="e.g., 245125733500"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Semester *</label>
                    <select
                      className="form-select"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Year *</label>
                    <select
                      className="form-select"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    >
                      {[1, 2, 3, 4].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Teacher-specific fields */}
            {role === "teacher" && (
              <>
                <div className="alert alert-info">
                  <small>
                    Teacher account allows you to manage classes, create exams, and track student performance.
                  </small>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Teacher ID *
                    </label>
                    <input
                      className="form-control"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      required
                      placeholder="e.g., T001"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Designation *
                    </label>
                    <select
                      className="form-select"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                    >
                      <option value="Assistant Professor">
                        Assistant Professor
                      </option>
                      <option value="Associate Professor">
                        Associate Professor
                      </option>
                      <option value="Professor">Professor</option>
                      <option value="Lecturer">Lecturer</option>
                      <option value="Guest Faculty">Guest Faculty</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Subjects Taught
                  </label>
                  <input
                    className="form-control"
                    value={subjectsTaught}
                    onChange={(e) => setSubjectsTaught(e.target.value)}
                    placeholder="e.g., Data Structures, Algorithms, DBMS (comma-separated)"
                  />
                  <small className="text-muted">
                    Enter subjects separated by commas
                  </small>
                </div>
              </>
            )}

            {/* Staff-specific fields */}
            {role === "staff" && (
              <>
                <div className="alert alert-info">
                  <small>
                    Staff account provides access to administrative functions based on your role.                    role.
                  </small>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Staff ID *</label>
                    <input
                      className="form-control"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      required
                      placeholder="e.g., S001"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Staff Type *
                    </label>
                    <select
                      className="form-select"
                      value={staffType}
                      onChange={(e) => setStaffType(e.target.value)}
                      required
                    >
                      <option value="general">General Staff</option>
                      <option value="librarian">Librarian</option>
                      <option value="admin-staff">Admin Staff</option>
                      <option value="lab-assistant">Lab Assistant</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={!isStrongPassword}
              className="btn btn-warning w-100 fw-bold py-2 mt-3"
              style={{ fontSize: "1.1rem" }}
            >
              Create Account
            </button>
          </form>

          {success && (
            <div className="alert alert-success mt-3">
              Account created successfully! Redirecting to login...
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}

          <div className="text-center mt-3">
            <small className="text-muted">
              Already have an account?{" "}
              <a href="/login" className="text-warning">
                Login
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
