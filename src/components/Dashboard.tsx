// import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { getSessionToken, useDescope } from "@descope/react-sdk";
import { useEffect, useState } from "react";
import {Student} from './utils/studentType';


function Dashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const navigate = useNavigate();
  const sessionToken = getSessionToken();
  const sdk = useDescope();
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
  };

  const navLeaderboard = () => {
    navigate("/leaderboard");
  };

  const navAdmin = () => {
    navigate("/admin");
  };

  const getStudentInfo = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    };

    console.log("Calling fetch....");
    fetch("/api/getStudentInfo", requestOptions)
      .then((response) => response.json())
      .then((data) => setStudent(data.studentObj));
  };

  useEffect(() => {
    getStudentInfo();
  }, []);

  const username = student ? student.username : "Loading...";
  const killCount = student ? student.killCount : "Loading...";
  const target = student ? student.target : "Loading...";
  const status = student ? student.status : "";
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);


  return (
    <>
      <nav className="navbar">
        <h1 className="app-name">ASSASSIN</h1>
        {sessionToken &&
        !sdk.isJwtExpired(sessionToken) &&
        sdk.getJwtRoles(sessionToken).includes("admin") ? (
          <button className="button" onClick={navAdmin}>
            Admin Portal
          </button>
        ) : (
          <></>
        )}
        <div className="username">{username}</div>
      </nav>
      <div className="body-wrapper">
        <h1>Dashboard</h1>
        <br></br>
        <strong>Target Name:</strong> {target}
        <br></br>
        <strong>Kill Count:</strong> {killCount}
        <br></br>
        <br></br>
        <button className="button" onClick={handleKill}>
          Register Kill
        </button>
        {/* <Modal
        open={open}
        onClose={handleClose}
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Modal Title
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Modal content text.
          </Typography>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal> */}
        {status == "pending" ? (
          <button className="button" onClick={handleDeath}>
            Register Death
          </button>
        ) : (
          <></>
        )}
        <button className="button" onClick={navLeaderboard}>
          Leaderboard
        </button>
        <br></br>
        {status == "pending" ? (
          //  <Link className="decline-death-link" to="/">
          //    Decline Death
          //  </Link>
          <button>
            <a href="https://www.google.com" target="_blank" className="button">
              Decline Death
            </a>
          </button>
        ) : (
          <></>
        )}
        {/* TODO: make this bottom bar spaced out properly / look better */}
        <nav className="navbarbottom">
          <Link className="rules-link" to="/">
            Rules
          </Link>
          <Link className="ticket-link" to="/">
            Ticket/Feedback
          </Link>
        </nav>
      </div>
    </>
  );
}
export default Dashboard;
