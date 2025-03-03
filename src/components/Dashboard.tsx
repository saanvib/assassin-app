// import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { getSessionToken, useDescope } from "@descope/react-sdk";
import { useEffect, useState } from "react";
import { Student } from "./utils/studentType";
import { Modal, Box, Typography, Button } from "@mui/material";

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
      .then((data) => {
         console.log(data.message)
         setStudent(data.studentObj)
      });
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
        setStudent(data.studentObj)
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

  //   TODO: change button styling colors different
  const username = student ? student.username : "Loading...";
  const killCount = student ? student.killCount : "Loading...";
  const target = student ? student.target : "Loading...";
  const status = student ? student.status : "Loading...";
  const targetStatus = student ? student.targetStatus : "Loading...";
  const assassin = student ? student.assassin : "Loading...";
  const [openKillModal, setOpenKillModal] = useState(false);
  const handleOpenKillModal = () => setOpenKillModal(true);
  const handleCloseKillModal = () => setOpenKillModal(false);
  const handleConfirmKill = () => {
    handleKill();
    setOpenKillModal(false);
  };
  const [openDeathModal, setOpenDeathModal] = useState(false);
  const handleOpenDeathModal = () => setOpenDeathModal(true);
  const handleCloseDeathModal = () => setOpenDeathModal(false);
  const handleConfirmDeath = () => {
    handleDeath();
    setOpenDeathModal(false);
  };
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
        <h2 className="pageTitle">Dashboard</h2>
        <br></br>
        <p className="pageText">Your Status: {status} </p>
        <p className="pageText">Kill Count: {killCount} </p>
        {status == "alive" || status == "pending" ? (
          <>
            <p className="pageText">Target Name: {target} </p>
            <p className="pageText">Target Status: {targetStatus} </p>
          </>
        ) : (
          <></>
        )}

        <br></br>
        {status == "alive" || status == "pending" ? (
          <button className="button" onClick={handleOpenKillModal}>
            Register Kill
          </button>
        ) : (
          <></>
        )}
        <Modal open={openKillModal} onClose={handleCloseKillModal}>
          <Box className="modalStyle">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirm your kill.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Killing {target}. Please confirm below.
            </Typography>
            <br></br>
            <button className="secondaryButton" onClick={handleConfirmKill}>
              Confirm Kill
            </button>
            <button className="secondaryButton" onClick={handleCloseKillModal}>
              Close
            </button>
          </Box>
        </Modal>
        {status == "pending" ? (
          <button className="button" onClick={handleOpenDeathModal}>
            Accept Death
          </button>
        ) : (
          <></>
        )}

        <Modal open={openDeathModal} onClose={handleCloseDeathModal}>
          <Box className="modalStyle">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Accept your death.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Confirm that you were killed by {assassin}.
            </Typography>
            <br></br>
            <button className="secondaryButton" onClick={handleConfirmDeath}>
              Confirm Death
            </button>
            <button className="secondaryButton" onClick={handleCloseDeathModal}>
              Close
            </button>
          </Box>
        </Modal>

        <button className="secondaryButton" onClick={navLeaderboard}>
          Leaderboard
        </button>
        <br></br>

        {/* TODO: add in all links */}
        <nav className="navbarbottom">
          <Link className="link" to="https://docs.google.com/document/d/11REzloMzacvjvCLawWyY8zGQ6Lf9uzpTgE7kG_Fnkd0/edit?usp=sharing">
            Rules
          </Link>
          {status == "pending" ? (
            <Link to="https://docs.google.com/forms/u/0/d/1ebDg6YeDxvELAaQYcZQhgwcgrYtTg2DLY9W7M3f4lDI/edit" className="link" target="_blank">
              <span>Dispute Death</span>
            </Link>
          ) : (
            <></>
          )}
          <Link className="link" to="https://docs.google.com/forms/d/e/1FAIpQLSfkfZ8Ei0CvT6lqIsaQmKltXfUw9dLcWGFWyI3BYI3Bg7l2NA/viewform?usp=sharing">
            Ticket/Feedback
          </Link>
        </nav>
      </div>
    </>
  );
}
export default Dashboard;
