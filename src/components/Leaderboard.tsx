import { useState } from "react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const columns = ["username", "killCount"];

  const refreshLeaderboard = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("Calling fetch....");
    fetch("/api/getLeaderboard", requestOptions)
      .then((response) => response.json())
      .then((data) => setLeaderboard(data.leaderboard));
  };

  return (
    <>
      <nav className="navbar">
        <h1 className="app-name">ASSASSIN</h1>
        <div className="username">Username</div>
      </nav>
      <div className="body-wrapper">
        Leaderboard
        <br></br>
        <button className="button" onClick={refreshLeaderboard}>
          Reveal
        </button>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Kill Count</th>
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
