

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import styles from "./Home.module.css";

const Home = () => {
    // ✅ FIX: Set the default state to show 'step1' and make content visible on load
    const [selectedRole, setSelectedRole] = useState("step1");
    const [selectedStatus, setSelectedStatus] = useState("Pending My Approval");
    const [contentVisible, setContentVisible] = useState(true);

    const [processNotes, setProcessNotes] = useState([]);
    const [roleCounts, setRoleCounts] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const currentUser = useMemo(() => {
        return localStorage.getItem("username") || null;
    }, []);

    const roleKeys = [ "step1", "step2", "hod", "zfc", "step3a", "step3b", "step4", "director", "cr", "gmfin", "cfo", "cooint", "rpteam", "ceo", "fwpan" ];
    const roleDisplayMap = {
        step1: "Step-1", step2: "Step-2", hod: "HOD", zfc: "ZFC",
        step3a: "Step-3A", step3b: "Step-3B", step4: "Step-4",
        director: "Director", cr: "CR", gmfin: "GM Fin", cfo: "CFO",
        cooint: "COOInt", rpteam: "RP TEAM", ceo: "CEO", fwpan: "FW-PAN",
    };

    const statusList = ["My Drafts", "Pending My Approval", "Approved by All"];
    const statusKeywordMap = {
        "My Drafts": "draft",
        "Pending My Approval": "submitted",
        "Approved by All": "approved",
    };

    useEffect(() => {
        if (!currentUser) return;
        let didCancel = false;

        const fetchCounts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/process/role-counts");
                if (!didCancel) setRoleCounts(res.data);
            } catch (err) { console.error("Error fetching role counts:", err); }
        };

        const fetchNotes = async () => {
            setLoading(true);
            try {
                const statusKey = statusKeywordMap[selectedStatus];
                const params = { status: statusKey, username: currentUser };

                if (statusKey === "submitted" && selectedRole) {
                    params.role = selectedRole;
                }

                const res = await axios.get("http://localhost:5000/api/process/all", { params });
                if (!didCancel) setProcessNotes(res.data);
            } catch (err) {
                if (!didCancel) setProcessNotes([]);
                console.error("Error fetching notes:", err);
            } finally {
                if (!didCancel) setLoading(false);
            }
        };

        fetchCounts();
        fetchNotes();

        return () => { didCancel = true; };
    }, [selectedRole, selectedStatus, currentUser]);

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.rolesRow}>
                    {roleKeys.map((key) => {
                        const label = roleDisplayMap[key] || key;
                        const count = roleCounts[key] || 0;
                        return (
                            <button
                                key={key}
                                className={`${styles.roleButton} ${selectedRole === key ? styles.active : ""}`}
                                onClick={() => {
                                    setSelectedRole(key);
                                    setSelectedStatus("Pending My Approval");
                                    setContentVisible(true);
                                }}
                            >
                                {label} ({count})
                            </button>
                        );
                    })}
                </div>

                {contentVisible && (
                    <>
                        <h3 className={styles.sectionTitle}>Process Notes</h3>
                        <div className={styles.statusRow}>
                            {statusList.map((status) => (
                                <button
                                    key={status}
                                    className={`${styles.statusButton} ${selectedStatus === status ? styles.active : ""}`}
                                    onClick={() => {
                                        setSelectedStatus(status);
                                        if (status !== 'Pending My Approval') {
                                            setSelectedRole(null);
                                        }
                                    }}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <div className={styles.table}>
                            <h4>{selectedStatus}</h4>
                            {loading ? <p>Loading...</p> : processNotes.length === 0 ? <p>No notes found.</p> : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th><th>Process Name</th><th>Company</th><th>Status</th><th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {processNotes.map((item, index) => {
                                            const isApprover = item.status === "submitted" && item.approvalFlow && Object.values(item.approvalFlow).includes(currentUser);
                                            const isCreator = item.createdBy === currentUser;
                                            return (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.processName}</td>
                                                    <td>{item.company}</td>
                                                    <td>{item.status}</td>
                                                    <td>
                                                        <button
                                                            className={styles.viewBtn}
                                                            onClick={() => navigate(isApprover ? `/role-approve/${item._id}` : `/view/${item._id}`)}
                                                        >
                                                            View
                                                        </button>
                                                        {item.status === 'draft' && isCreator && (
                                                            <button
                                                                className={styles.editBtn}
                                                                onClick={() => navigate(`/edit/${item._id}`)}
                                                                style={{ marginLeft: "8px" }}
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <button className={styles.addNewButton} onClick={() => navigate("/add-new")}>
                            + Add New
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default Home;