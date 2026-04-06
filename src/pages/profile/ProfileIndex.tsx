import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const ProfileIndex = () => {
  const userRole = useSelector((state: RootState) => state.user.userRole);

  if (userRole === "MANAGER") return <Navigate to="/profile/dashboard" replace />;
  if (userRole === "AUTO DETAILER") return <Navigate to="/profile/production" replace />;
  if (userRole === "CUSTOMER SERVICE AGENT") return <Navigate to="/profile/rental" replace />;

  return null;
};

export default ProfileIndex;
