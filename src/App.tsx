import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Leaderboard from "./components/Leaderboard.tsx";
import React from "react";
import Admin from "./components/Admin.tsx";

function App() {
  return (
    <>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/" element={<Login />} />
            <Route path="/requestnew" element={<Dashboard />} />
            <Route path="/absences" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </>
  );
}

export default App;
