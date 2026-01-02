import { Outlet } from "react-router-dom";
import AdminSidebar from "./SideBar";



const Admin = () => {
    return (
        <>
            <div className="header">
            <AdminSidebar/>
            </div>
            <Outlet />
            <div className="footer">

            </div>
        </>
    )
}
export default Admin;