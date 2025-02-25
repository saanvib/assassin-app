// import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { getSessionToken } from "@descope/react-sdk";

function Dashboard() {
  const navigate = useNavigate();
  // TODO: get Target and Kill Count
  //   const [target, setTarget] = useState("");
  //   const [killCount, setKillCount] = useState(0);
  const sessionToken = getSessionToken();
  const handleKill = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    };
    fetch("/api/registerKill", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data.message));
    console.log("Button was clicked!");
    // Add your desired functionality here
  };

  const handleDeath = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    };
    fetch("/api/registerDeath", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        console.log(data.statusCode);
      });

    console.log("Button was clicked!");
    // Add your desired functionality here
  };

  const navNewTargetReq = () => {
    navigate("/requestnew");
    console.log("Button was clicked!");
    // Add your desired functionality here
  };

  const navLeaderboard = () => {
    navigate("/leaderboard");
    console.log("Button was clicked!");
    // Add your desired functionality here
  };

  const navRegisterAbsence = () => {
    navigate("/absences");
    console.log("Button was clicked!");
    // Add your desired functionality here
  };

  return (
    <>
      <nav className="navbar">
        <h1 className="app-name">ASSASSIN</h1>
        <div className="username">Username</div>
      </nav>
      <div className="body-wrapper">
        Dashboard
        <br></br>
        <br></br>
        Target Name: Example
        <br></br>
        Kill Count: []
        <br></br>
        <button className="button" onClick={handleKill}>
          Register Kill
        </button>
        <br></br>
        <button className="button" onClick={handleDeath}>
          Register Death
        </button>
        <br></br>
        <button className="button" onClick={navNewTargetReq}>
          Request New Target
        </button>
        <br></br>
        <button className="button" onClick={navLeaderboard}>
          Leaderboard
        </button>
        <br></br>
        {/* TODO: make this bottom bar / spaced out properly */}
        <nav className="navbarbottom">
          <button className="button" onClick={navRegisterAbsence}>
            Register Absence
          </button>
          <Link className="rules-link" to="/">Rules</Link>
          <Link className="ticket-link" to="/">Ticket/Feedback</Link>
        </nav>
      </div>
    </>
  );
}
export default Dashboard;
