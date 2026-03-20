import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const ui = useSelector((state: RootState) => state.ui.notification);

  return (
    <>
      {ui && <>Notification</>}
      <Routes>
        {!isLoggedIn && <Route path="/" element={<>Home</>} />}
        {!isLoggedIn && <Route path="/auth" element={<>Auth</>} />}
        {isLoggedIn && <Route path="/" element={<Navigate to={"/profile"} />} />}
        {isLoggedIn && <Route path="/profile" element={<>Profile</>} />}
        {isLoggedIn && <Route path="/profile/fleet" element={<>Profile</>} />}
        {isLoggedIn && <Route path="/profile/fleet/add" element={<>Profile</>} />}
        {isLoggedIn && <Route path="/profile/fleet/update" element={<>Profile</>} />}
        {isLoggedIn && <Route path="/profile/production" element={<>Profile</>} />}
        {isLoggedIn && <Route path="/profile/production/add" element={<>Profile</>} />}
        {isLoggedIn && <Route path="/profile/rental" element={<>Profile</>} />}
        {isLoggedIn && <Route path="/profile/rental/add" element={<>Profile</>} />}
        <Route path="*" element={<>404 Not Found</>} />
      </Routes>
    </>
  );
}

export default App;
