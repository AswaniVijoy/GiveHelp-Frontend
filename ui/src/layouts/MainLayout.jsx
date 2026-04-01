import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <ToastContainer position="top-right" autoClose={3000} />
  </>
);

export default MainLayout;
