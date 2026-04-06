import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import type { UserRole } from "../types";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { uiActions } from "../store/slices/ui-slice";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const getDefaultRoute = (role: UserRole | null): string => {
  switch (role) {
    case "AUTO DETAILER":
      return "/profile/production";
    case "CUSTOMER SERVICE AGENT":
      return "/profile/rental";
    case "MANAGER":
    default:
      return "/profile";
  }
};

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userRole = useSelector((state: RootState) => state.user.userRole);

  const isAuthorized = userRole !== null && allowedRoles.includes(userRole);

  useEffect(() => {
    if (!isAuthorized) {
      dispatch(
        uiActions.showNotification({
          title: "Access Denied",
          message: "You don't have permission to access this page.",
        }),
      );
      navigate(getDefaultRoute(userRole));
    }
  }, []);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
