import React, { useState } from "react";
import axios from "axios";

const AddAuthorizedUser = () => {
  const [formData, setFormData] = useState({
    role: "",
    id: "",
    password: "",
    department: "",
    zone: "",
    state: "",
    reportingTo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/authorized-users/add", formData);
      alert("User created!");
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map((field) => (
        <div key={field}>
          <label>{field}</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit">Add Authorized User</button>
    </form>
  );
};

export default AddAuthorizedUser;
