import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import styles from "./ViewNote.module.css";

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/process/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error("Error fetching process note:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!note) return <div className={styles.loading}>Note not found</div>;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2>View Process Note</h2>

        <div className={styles.group}><strong>Process Name:</strong> {note.processName}</div>
        <div className={styles.group}><strong>Company:</strong> {note.company}</div>
        <div className={styles.group}><strong>Zone:</strong> {note.zone}</div>
        <div className={styles.group}><strong>Department:</strong> {note.department}</div>
        <div className={styles.group}><strong>Category:</strong> {note.category}</div>
        <div className={styles.group}><strong>Status:</strong> {note.status}</div>

        <div className={styles.textBlock}>
          <strong>Background:</strong>
          <p>{note.background}</p>
        </div>
        <div className={styles.textBlock}>
          <strong>Process Objective:</strong>
          <p>{note.processObjective}</p>
        </div>
        <div className={styles.textBlock}>
          <strong>Process Details:</strong>
          <p>{note.processDetails}</p>
        </div>
        <div className={styles.textBlock}>
          <strong>Responsibility:</strong>
          <p>{note.responsibility}</p>
        </div>

        <h3>Approval Flow</h3>
        <div className={styles.approvalBox}>
          {note.approvalFlow &&
            Object.entries(note.approvalFlow).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value || "N/A"}
              </div>
            ))}
        </div>

        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    </>
  );
};

export default ViewNote;
