import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import styles from "./Navbar.module.css";
import banner from "../assets/siti-banner.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); 
  };

  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className={styles.navbarContainer}>
      <img src={banner} alt="Banner" className={styles.banner} />

      <div className={styles.navbar}>
        <div className={styles.left}>
          <FaHome className={styles.homeIcon} onClick={goToHome} />
        </div>

        <div className={styles.center}>
          <h1>SITI Process Approval Note</h1>
        </div>

        <div className={styles.right}>
          <Link to="/admin-dashboard" className={styles.navLink}>Admin Dashboard</Link>
          <Link to="/change-password" className={styles.navLink}>Change Password</Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div className={styles.username}>
        Logged in as: <span>{username}</span>
      </div>
    </div>
  );
};

export default Navbar;
