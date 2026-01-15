import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import styles from "./ChangePassword.module.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%&])[A-Za-z\d@#$!%&]{8,}$/;
    return pattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("❌ All fields are required.");
      setSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match.");
      setSuccess(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage("❌ Password does not meet complexity requirements.");
      setSuccess(false);
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const username = storedUser?.username;

      if (!username) {
        setMessage("❌ User not logged in.");
        setSuccess(false);
        return;
      }

      const res = await axios.post("http://localhost:5000/api/auth/change-password", {
        username,
        oldPassword,
        newPassword,
      });

      setMessage(`✅ ${res.data.message}`);
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setSuccess(false);
      const errorMsg =
        err.response?.data?.message || "❌ Server error. Try again.";
      setMessage(`❌ ${errorMsg}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2>Change Password</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Update Password
          </button>

          {message && (
            <p className={success ? styles.success : styles.error}>{message}</p>
          )}

          <div className={styles.note}>
            <strong>Note:</strong> Password must be at least 8 characters long and include:
            <ul>
              <li>At least one uppercase and one lowercase letter</li>
              <li>At least one special character (e.g., @, #, $, !, %)</li>
              <li>At least one numeric character (0–9)</li>
            </ul>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
