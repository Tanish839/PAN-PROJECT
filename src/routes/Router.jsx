import { Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/LoginPage/LoginForm";
import HomePage from "../Pages/HomePage/Home";
import ChangePasswordPage from "../Pages/ChangePasswordPage/ChangePassword";
import AddNewPage from "../Pages/AddNewPage/AddNew";
import ViewNote from "../Pages/ViewNotePage/ViewNote";
import EditNote from "../Pages/EditNotePage/EditNote"
import PrivateRoute from "./PrivateRoute"; 
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import RoleApproveNote from "../Pages/RoleApproveNote/RoleApprove";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* ✅ Protected routes */}
      <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
      <Route path="/add-new" element={<PrivateRoute><AddNewPage /></PrivateRoute>} />
      <Route path="/view/:id" element={<PrivateRoute><ViewNote /></PrivateRoute>} />
        <Route path="/edit/:id" element={<EditNote />} /> 
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
    <Route path="/role-approve/:id" element={<RoleApproveNote />} />

        </Routes>
  );
};

export default AppRouter;
