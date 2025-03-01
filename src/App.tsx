import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Leaderboard from "./components/Leaderboard.tsx";
import React from "react";
import Admin from "./components/Admin.tsx";
import ProtectedRoutes from "./components/utils/ProtectedRoutes.tsx";
import ProtectedAdminRoutes from "./components/utils/ProtectedAdminRoutes.tsx";

function App() {
  return (
    <>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>
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
