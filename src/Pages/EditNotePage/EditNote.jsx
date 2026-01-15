import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import styles from "./EditNote.module.css";

const EditNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem("username");

    // Initialize with a full default structure to prevent errors
    const [formData, setFormData] = useState({
        processName: '', company: '', zone: '', department: '', category: '',
        businessCase: '', budgetType: '', background: '', processObjective: '',
        processDetails: '', responsibility: '', otherDetails: '', oldPanReference: '',
        timelineStart: '', timelineEnd: '',
        approvalFlow: {},
    });
    
    const [approverOptions, setApproverOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const roleDisplayMap = {
        step1: "Step-1", step2: "Step-2", hod: "HOD", zfc: "ZFC",
        step3a: "Step-3A", step3b: "Step-3B", step4: "Step-4",
        director: "Director", cr: "CR", gmfin: "GM Fin", cfo: "CFO",
        cooint: "COOInt", rpteam: "RP TEAM", ceo: "CEO", fwpan: "FW-PAN",
    };

    useEffect(() => {
        const fetchNoteAndApprovers = async () => {
            try {
                const [noteRes, approversRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/process/${id}`),
                    axios.get("http://localhost:5000/api/authorized-users/all")
                ]);
                
                const fetchedNote = noteRes.data;
                setApproverOptions(approversRes.data);

                const isCreator = fetchedNote.createdBy === loggedInUser;
                const isDraft = fetchedNote.status === "draft";
                
                if (isCreator && isDraft) {
                    setIsAuthorized(true);
                    // Format dates correctly for the input[type=date] fields
                    const formattedNote = {
                        ...fetchedNote,
                        timelineStart: fetchedNote.timelineStart ? new Date(fetchedNote.timelineStart).toISOString().split('T')[0] : '',
                        timelineEnd: fetchedNote.timelineEnd ? new Date(fetchedNote.timelineEnd).toISOString().split('T')[0] : '',
                    };
                    setFormData(formattedNote);
                } else {
                    setIsAuthorized(false);
                    alert("You are not authorized to edit this note.");
                    navigate("/home");
                }
            } catch (err) {
                console.error("Error loading page data:", err);
                alert("Failed to load the note.");
                navigate("/home");
            } finally {
                setLoading(false);
            }
        };

        fetchNoteAndApprovers();
    }, [id, loggedInUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (formData.approvalFlow && Object.keys(formData.approvalFlow).includes(name)) {
            setFormData((prev) => ({
                ...prev,
                approvalFlow: { ...prev.approvalFlow, [name]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e, statusType) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const dataToUpdate = { ...formData, status: statusType };
            await axios.put(`http://localhost:5000/api/process/update/${id}`, dataToUpdate);
            alert(`Note ${statusType === 'draft' ? 'saved' : 'submitted'} successfully!`);
            navigate("/home");
        } catch (err) {
            console.error("Error updating note:", err);
            alert("Failed to update note.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h2>Edit Process Note</h2>
                {isAuthorized ? (
                    <form className={styles.form}>
                        {/* --- ALL YOUR FORM FIELDS ARE NOW INCLUDED --- */}
                        <div className={styles.inputGroup}>
                            <label>Process Name<span className={styles.required}>*</span></label>
                            <input type="text" name="processName" value={formData.processName || ""} onChange={handleChange} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Company Name<span className={styles.required}>*</span></label>
                            <select name="company" value={formData.company || ""} onChange={handleChange} required >
                                <option value="">-- Select Company --</option>
                                <option>SITI Networks</option>
                                <option>Essel Group</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Zone Name<span className={styles.required}>*</span></label>
                            <select name="zone" value={formData.zone || ""} onChange={handleChange} required>
                                <option value="">-- Select Zone --</option>
                                <option>North</option><option>South</option><option>East</option><option>West</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Department<span className={styles.required}>*</span></label>
                            <select name="department" value={formData.department || ""} onChange={handleChange} required >
                                <option value="">-- Select Department --</option>
                                <option>Technical</option><option>Finance</option><option>HR</option><option>Sales</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Category<span className={styles.required}>*</span></label>
                            <select name="category" value={formData.category || ""} onChange={handleChange} required>
                                <option value="">-- Select Category --</option>
                                <option>CAPEX</option><option>OPEX</option><option>Other</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Business Case</label>
                            <select name="businessCase" value={formData.businessCase || ""} onChange={handleChange}>
                                <option value="">-- Select Business Case --</option>
                                <option>Justification A</option><option>Justification B</option>
                            </select>
                        </div>
                        
                        <div className={styles.inputGroup}>
                            <label>Budget Type:</label>
                            <div className={styles.radioGroup}>
                                <label><input type="radio" name="budgetType" value="Budgeted" checked={formData.budgetType === "Budgeted"} onChange={handleChange} /> Budgeted</label>
                                <label><input type="radio" name="budgetType" value="Non-Budgeted" checked={formData.budgetType === "Non-Budgeted"} onChange={handleChange} /> Non-Budgeted</label>
                            </div>
                        </div>

                        <div className={styles.inputGroup}><label>Background:</label><textarea name="background" rows="3" value={formData.background || ""} onChange={handleChange} required /></div>
                        <div className={styles.inputGroup}><label>Process Objective:</label><textarea name="processObjective" rows="3" value={formData.processObjective || ""} onChange={handleChange} required /></div>
                        <div className={styles.inputGroup}><label>Process Details:</label><textarea name="processDetails" rows="3" value={formData.processDetails || ""} onChange={handleChange} required /></div>
                        <div className={styles.inputGroup}><label>Responsibility:</label><textarea name="responsibility" rows="3" value={formData.responsibility || ""} onChange={handleChange} required /></div>
                        <div className={styles.inputGroup}><label>Other Details:</label><input type="text" name="otherDetails" value={formData.otherDetails || ""} onChange={handleChange} /></div>
                        <div className={styles.inputGroup}><label>Old PAN Reference:</label><input type="text" name="oldPanReference" value={formData.oldPanReference || ""} onChange={handleChange} /></div>
                        <div className={styles.inputGroup}><label>Timeline Start:</label><input type="date" name="timelineStart" value={formData.timelineStart || ""} onChange={handleChange} /></div>
                        <div className={styles.inputGroup}><label>Timeline End:</label><input type="date" name="timelineEnd" value={formData.timelineEnd || ""} onChange={handleChange} /></div>
                        
                        <h3>Approval Flow</h3>
                        {formData.approvalFlow && Object.keys(formData.approvalFlow).map((key) => (
                            <div className={styles.group} key={key}>
                                <label>{roleDisplayMap[key] || key}:</label>
                                {key === "step1" || key === "ceo" ? (
                                    <input type="text" value={formData.approvalFlow[key] || ''} disabled />
                                ) : (
                                    <select name={key} value={formData.approvalFlow[key] || ''} onChange={handleChange}>
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
                            <button type="button" className={styles.draftBtn} onClick={(e) => handleSubmit(e, 'draft')} disabled={submitting}>
                                {submitting ? "Saving..." : "Save Changes (Keep as Draft)"}
                            </button>
                            <button type="button" className={styles.submitBtn} onClick={(e) => handleSubmit(e, 'submitted')} disabled={submitting}>
                                {submitting ? "Submitting..." : "Submit for Approval"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p style={{ color: "red" }}>Loading authorization or you are not authorized to edit this note.</p>
                )}

                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    ← Go Back
                </button>
            </div>
        </>
    );
};

export default EditNote;