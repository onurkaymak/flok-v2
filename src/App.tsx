import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

import Splash from "./pages/Splash";
import Auth from "./pages/auth";
import Profile from "./pages/profile";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const ui = useSelector((state: RootState) => state.ui.notification);

  return (
    <>
      {ui && <>Notification</>}
      <Routes>
        {!isLoggedIn && <Route path="/" element={<Splash />} />}
        {!isLoggedIn && <Route path="/auth" element={<Auth />} />}
        {isLoggedIn && <Route path="/" element={<Navigate to={"/profile"} />} />}
        {isLoggedIn && (
          <Route path="/profile" element={<Profile />}>
            <Route path="fleet" element={<>Profile</>} />
            <Route path="fleet/add" element={<>Profile</>} />
            <Route path="fleet/update" element={<>Profile</>} />
            <Route path="production" element={<>Profile</>} />
            <Route path="production/add" element={<>Profile</>} />
            <Route path="rental" element={<>Profile</>} />
            <Route path="rental/add" element={<>Profile</>} />
          </Route>
        )}
        <Route path="*" element={<>404 Not Found</>} />
      </Routes>
    </>
  );
}

export default App;
