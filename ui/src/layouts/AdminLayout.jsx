import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => (
  <div className="bg-gray-50 text-gray-800 min-h-screen flex">
    <AdminSidebar />
    <main className="flex-1"><Outlet /></main>
  </div>
);

export default AdminLayout;
