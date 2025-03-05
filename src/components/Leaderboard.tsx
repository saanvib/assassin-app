import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const columns = ["username", "killCount"];
  const navigate = useNavigate();

  const refreshLeaderboard = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("Calling fetch....");
    fetch("/api/getLeaderBoard", requestOptions)
      .then((response) => response.json())
      .then((data) => setLeaderboard(data.leaderboard));
  };

  useEffect(() => {
      refreshLeaderboard();
    }, []);

  const navDashboard = () => {
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <h1 className="app-name">ASSASSIN</h1>
        <button className="button" onClick={navDashboard}>
          Dashboard
        </button>
        <div></div>
      </nav>
      <div className="body-wrapper">
      <h2 className="pageTitle">Leaderboard</h2>
        <br></br>
        {/* <button className="button" onClick={refreshLeaderboard}>
          Refresh Leaderboard
        </button> */}
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="table-header">Username</th>
              <th className="table-header">Kill Count</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default Leaderboard;
