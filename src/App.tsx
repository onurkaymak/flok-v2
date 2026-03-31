import { useEffect, useCallback } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { useAppDispatch } from "./hooks/useAppDispatch";

import { logOutUser } from "./store/actions/auth-actions";

import Splash from "./pages/Splash";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import type { User } from "./types";
import { userActions } from "./store/slices/user-slice";
import Fleet from "./pages/fleet";
import Notification from "./layout/Notification";
import AddVehicle from "./pages/fleet/AddVehicle";
import UpdateVehicle from "./pages/fleet/UpdateVehicle";
import Rental from "./pages/rental";

import ProtectedRoute from "./layout/ProtectedRoute";
import AddRental from "./pages/profile/AddRental";

export let logoutTimer: ReturnType<typeof setTimeout> | null = null;

export const calculateRemainingTime = (expirationTime: string) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const ui = useSelector((state: RootState) => state.ui.notification);
  const dispatch = useAppDispatch();

  const logOutHandler = useCallback(() => {
    dispatch(logOutUser());
    if (logoutTimer) clearTimeout(logoutTimer);
  }, [dispatch]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData") ?? "{}");

    if (storedData && storedData.token && new Date(storedData.tokenExpTime) > new Date()) {
      const info: User = {
        userId: storedData.userId,
        token: storedData.token,
        tokenExpTime: storedData.tokenExpTime,
        userRole: storedData.userRole,
        name: storedData.name,
        isLoggedIn: true,
      };
      dispatch(userActions.login(info));

      const remainingTime = calculateRemainingTime(storedData.tokenExpTime);
      logoutTimer = setTimeout(() => logOutHandler(), remainingTime);
    } else {
      logOutHandler();
    }
  }, [dispatch, logOutHandler]);

  return (
    <>
      {ui && <Notification title={ui.title} message={ui.message} />}
      <Routes>
        {!isLoggedIn && <Route path="/" element={<Splash />} />}
        {!isLoggedIn && <Route path="/auth" element={<Auth />} />}
        {isLoggedIn && <Route path="/" element={<Navigate to={"/profile"} />} />}
        {isLoggedIn && (
          <Route path="/profile" element={<Profile />}>
            <Route path="fleet" element={<Fleet />} />
            <Route
              path="fleet/add"
              element={
                <ProtectedRoute allowedRoles={["MANAGER"]}>
                  <AddVehicle />
                </ProtectedRoute>
              }
            />
            <Route
              path="fleet/update"
              element={
                <ProtectedRoute allowedRoles={["MANAGER"]}>
                  <UpdateVehicle />
                </ProtectedRoute>
              }
            />
            <Route
              path="production"
              element={
                <ProtectedRoute allowedRoles={["MANAGER", "AUTO DETAILER"]}>
                  <>Production</>
                </ProtectedRoute>
              }
            />
            <Route
              path="production/add"
              element={
                <ProtectedRoute allowedRoles={["MANAGER", "AUTO DETAILER"]}>
                  <>Production Add</>
                </ProtectedRoute>
              }
            />
            <Route
              path="rental"
              element={
                <ProtectedRoute allowedRoles={["MANAGER", "CUSTOMER SERVICE AGENT"]}>
                  <Rental />
                </ProtectedRoute>
              }
            />
            <Route
              path="rental/add"
              element={
                <ProtectedRoute allowedRoles={["MANAGER", "CUSTOMER SERVICE AGENT"]}>
                  <AddRental />
                </ProtectedRoute>
              }
            />
          </Route>
        )}
        {!isLoggedIn && <Route path="/profile" element={<Navigate to="/" />} />}
        <Route path="*" element={<>404 Not Found</>} />
      </Routes>
    </>
  );
}

export default App;
