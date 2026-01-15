
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    role: "",
    id: "",
    password: "",
    department: "",
    zone: "",
    state: "",
    reportingTo: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/authorized-users/all");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
await axios.post("http://localhost:5000/api/authorized-users/add", form);


      alert("User added successfully");

      setForm({
        name: "",
        role: "",
        id: "",
        password: "",
        department: "",
        zone: "",
        state: "",
        reportingTo: "",
      });

      fetchUsers();
   } catch (err) {
  console.error("Error adding user", err.response?.data || err.message); // shows backend error
  alert("Failed to add user: " + (err.response?.data?.error || "Unknown error"));
}

  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Admin Dashboard - Authorized Users</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>Add Authorized User</h3>

          {/* Name Field */}
          <div className={styles.inputGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Other Fields */}
          {["role", "id", "password", "department", "zone", "state", "reportingTo"].map((field) => (
            <div className={styles.inputGroup} key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button type="submit" className={styles.submitBtn}>Add User</button>
        </form>

        <h3>Existing Users</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>ID</th>
              <th>Department</th>
              <th>Zone</th>
              <th>State</th>
              <th>Reporting To</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7">No users found</td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.id}</td>
                  <td>{user.department}</td>
                  <td>{user.zone}</td>
                  <td>{user.state}</td>
                  <td>{user.reportingTo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;
