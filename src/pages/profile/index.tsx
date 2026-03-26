import { Outlet } from "react-router";
import Navbar from "../../layout/Navbar";
import Sidebar from "../../layout/Sidebar";

const Profile = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Profile;
