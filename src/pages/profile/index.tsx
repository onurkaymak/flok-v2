import { Outlet } from "react-router";

import Navbar from "../../layout/Navbar";
import Sidebar from "../../layout/Sidebar";

const Profile = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Profile;
