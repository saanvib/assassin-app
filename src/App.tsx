import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import React from "react";
import Admin from "./components/Admin";
import ProtectedRoutes from "./components/utils/ProtectedRoutes";
import ProtectedAdminRoutes from "./components/utils/ProtectedAdminRoutes";

function App() {
  return (
    <>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route element={<ProtectedRoutes />}> */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            {/* </Route> */}
            <Route element={<ProtectedAdminRoutes />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </>
  );
}

export default App;
