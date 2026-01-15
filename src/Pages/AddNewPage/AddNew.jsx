import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import styles from "./AddNew.module.css";
const roleDisplayMap = {
  step1: "Step-1",
  step2: "Step-2",
  hod: "HOD",
  zfc: "ZFC",
  step3a: "Step-3A",
  step3b: "Step-3B",
  step4: "Step-4",
  director: "Director",
  cr: "CR",
  gmfin: "GM Fin",
  cfo: "CFO",
  cooint: "COOInt",
  rpteam: "RP TEAM",
  ceo: "CEO",
  fwpan: "FW-PAN",
};
const AddNew = () => {
  const [formData, setFormData] = useState({
    processName: "",
    company: "",
    zone: "",
    department: "",
    category: "",
    businessCase: "",
    businessAttachment: null,
    budgetType: "",
    background: "",
    processObjective: "",
    processDetails: "",
    responsibility: "",
    otherDetails: "",
    oldPanReference: "",
    attachment: null,
    timelineStart: "",
    timelineEnd: "",
    createdBy: "",
    approvalFlow: {
      step1: "",
      step2: "",
      hod: "",
      zfc: "",
      step3a: "",
      step3b: "",
      step4: "",
      director: "",
      cr: "",
      gmfin: "",
      cfo: "",
      cooint: "",
      rpteam: "",
      ceo: "Yogesh Sharma",
      fwpan: "",
    },
  });

  const [approverOptions, setApproverOptions] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (username) {
      setFormData((prev) => ({
        ...prev,
        createdBy: username,
        approvalFlow: {
          ...prev.approvalFlow,
          step1: username,
        },
      }));
    }
    const fetchApprovers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/authorized-users/all"
        );

        setApproverOptions(res.data); 
      } catch (error) {
        console.error("Failed to fetch approvers:", error);
      }
    };

    fetchApprovers(); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.approvalFlow) {
      setFormData((prev) => ({
        ...prev,
        approvalFlow: {
          ...prev.approvalFlow,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e, statusType) => {
    e.preventDefault();
    try {
      const fd = new FormData();

      for (let key in formData) {
        if (key === "approvalFlow") {
          for (let step in formData.approvalFlow) {
            fd.append(`approvalFlow[${step}]`, formData.approvalFlow[step]);
          }
        } else if (key === "businessAttachment" || key === "attachment") {
          if (formData[key]) {
            fd.append(key, formData[key]);
          }
        } else {
          fd.append(key, formData[key]);
        }
      }

      fd.append("status", statusType);

      await axios.post("http://localhost:5000/api/process/add", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`Process Note ${statusType} successfully!`);
    } catch (err) {
      console.error(err);
      alert("Error saving process note");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <p className={styles.redNote}>All fields are mandatory.</p>
        <h2 className={styles.heading}>Create New Process Note</h2>

        <form
          className={styles.form}
          onSubmit={(e) => handleSubmit(e, "submitted")}
        >
          {/* Main form inputs */}
          <div className={styles.inputGroup}>
            <label>
              Process Name<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="processName"
              value={formData.processName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              Company Name<span className={styles.required}>*</span>
            </label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Company --</option>
              <option>SITI Networks</option>
              <option>Essel Group</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Zone Name<span className={styles.required}>*</span>
            </label>
            <select
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Zone --</option>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Department<span className={styles.required}>*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Department --</option>
              <option>Technical</option>
              <option>Finance</option>
              <option>HR</option>
              <option>Sales</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Category<span className={styles.required}>*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              <option>CAPEX</option>
              <option>OPEX</option>
              <option>Other</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Business Case</label>
            <select
              name="businessCase"
              value={formData.businessCase}
              onChange={handleChange}
            >
              <option value="">-- Select Business Case --</option>
              <option>Justification A</option>
              <option>Justification B</option>
            </select>
          </div>

          <p className={styles.redNote}>
            Please attach business case or provide justification.
          </p>

          <div className={styles.inputGroup}>
            <label>Business Attachment:</label>
            <input
              type="file"
              name="businessAttachment"
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Budget Type:</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="budgetType"
                  value="Budgeted"
                  onChange={handleChange}
                />{" "}
                Budgeted
              </label>
              <label>
                <input
                  type="radio"
                  name="budgetType"
                  value="Non-Budgeted"
                  onChange={handleChange}
                />{" "}
                Non-Budgeted
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.redNote}>
              <input type="checkbox" required /> Ensure correct selection.
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Background<span className={styles.required}>*</span>
            </label>
            <textarea
              name="background"
              value={formData.background}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              Process Objective<span className={styles.required}>*</span>
            </label>
            <textarea
              name="processObjective"
              value={formData.processObjective}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              Process Details<span className={styles.required}>*</span>
            </label>
            <textarea
              name="processDetails"
              value={formData.processDetails}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Timeline:</label>
            <div className={styles.timeline}>
              <input
                type="date"
                name="timelineStart"
                value={formData.timelineStart}
                onChange={handleChange}
              />
              <input
                type="date"
                name="timelineEnd"
                value={formData.timelineEnd}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Responsibility<span className={styles.required}>*</span>
            </label>
            <textarea
              name="responsibility"
              value={formData.responsibility}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Other Details</label>
            <input
              type="text"
              name="otherDetails"
              value={formData.otherDetails}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Old PAN Reference</label>
            <input
              type="text"
              name="oldPanReference"
              value={formData.oldPanReference}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Attachment:</label>
            <input type="file" name="attachment" onChange={handleFileChange} />
          </div>

          {/* Approval Flow Section */}
          <h3 className={styles.subHeading}>Approval Flow</h3>

          {Object.keys(formData.approvalFlow).map((key) => (
            <div className={styles.inputGroup} key={key}>
              <label>{roleDisplayMap[key] || key}</label>

              {key === "step1" || key === "ceo" ? (
                <input
                  type="text"
                  name={key}
                  value={formData.approvalFlow[key]}
                  disabled
                />
              ) : (
                <select
                  name={key}
                  value={formData.approvalFlow[key]}
                  onChange={handleChange}
                >
                  <option value="">-- Select User --</option>
                  {approverOptions.map((user) => (
                    <option key={user._id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.draftBtn}
              onClick={(e) => handleSubmit(e, "draft")}
            >
              Save as Draft
            </button>
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>

          <p className={styles.f5note}>
            If you can't see Submit button, press F5.
          </p>
        </form>
      </div>
    </>
  );
};

export default AddNew;
