import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import styles from "./RoleApprove.module.css"; 

const RoleApprove = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loggedInUser = localStorage.getItem("username");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/process/${id}`);
        setNote(res.data);

        const currentRole = Object.keys(res.data.approvalFlow || {}).find(
          (key) => res.data.approvalFlow[key] === loggedInUser
        );
        setUserRole(currentRole);
      } catch (err) {
        console.error("Error fetching process note:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleAction = async (decision) => {
    try {
      setActionLoading(true);
      const url =
        decision === "approve"
          ? `http://localhost:5000/api/process/approve/${id}`
          : `http://localhost:5000/api/process/reject/${id}`;

      const method = decision === "approve" ? axios.patch : axios.put;

      await method(url, { username: loggedInUser });
      alert(`Note ${decision}d successfully.`);
      navigate("/home");
    } catch (err) {
      console.error("Action failed:", err);
      alert("Failed to update note status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!note) return <div className={styles.loading}>Note not found</div>;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2>Approve Process Note - Role: {userRole || "N/A"}</h2>

        <div className={styles.group}><strong>Process Name:</strong> {note.processName}</div>
        <div className={styles.group}><strong>Company:</strong> {note.company}</div>
        <div className={styles.group}><strong>Zone:</strong> {note.zone}</div>
        <div className={styles.group}><strong>Department:</strong> {note.department}</div>
        <div className={styles.group}><strong>Category:</strong> {note.category}</div>
        <div className={styles.group}><strong>Status:</strong> {note.status}</div>

        <div className={styles.textBlock}><strong>Background:</strong><p>{note.background}</p></div>
        <div className={styles.textBlock}><strong>Process Objective:</strong><p>{note.processObjective}</p></div>
        <div className={styles.textBlock}><strong>Process Details:</strong><p>{note.processDetails}</p></div>
        <div className={styles.textBlock}><strong>Responsibility:</strong><p>{note.responsibility}</p></div>

        <h3>Approval Flow</h3>
        <div className={styles.approvalBox}>
          {note.approvalFlow &&
            Object.entries(note.approvalFlow).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value || "N/A"}
              </div>
            ))}
        </div>

        {note.status === "submitted" && userRole && (
          <div className={styles.actions}>
            <button
              className={styles.approveBtn}
              onClick={() => handleAction("approve")}
              disabled={actionLoading}
            >
              ✅ Approve
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() => handleAction("reject")}
              disabled={actionLoading}
            >
              🔙 Send Back
            </button>
          </div>
        )}

        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    </>
  );
};

export default RoleApprove;
