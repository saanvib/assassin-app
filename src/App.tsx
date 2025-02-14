import { useState } from "react";
import Alert from "./components/Dashboard.tsx";
import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
import { getSessionToken } from "@descope/react-sdk";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./components/Login.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Leaderboard from "./components/Leaderboard.tsx";

function App() {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user, isUserLoading } = useUser();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </BrowserRouter>
      
    </>
  );
  const [msg, setMessage] = useState("");

  fetch("/api/getLeaderBoard?query=saanvi")
    .then((response) => response.json())
    .then((data) => setMessage(data.message));

  return (
    <div>
      <Alert>{msg}</Alert>
    </div>
  );
}

export default App;
