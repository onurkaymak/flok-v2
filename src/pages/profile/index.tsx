import { Outlet } from "react-router";

import Navbar from "../../layout/Navbar";

const Profile = () => {
  return (
    <>
      <Navbar />
      <>Sidebar</>
      <Outlet />
    </>
  );
};

export default Profile;
