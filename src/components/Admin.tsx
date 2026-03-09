import { useEffect, useMemo, useState } from "react";
import { getSessionToken } from "@descope/react-sdk";
import { Student } from "./utils/studentType";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useNavigate } from "react-router-dom";
import { WidthFull } from "@mui/icons-material";

function Admin() {
  const sessionToken = getSessionToken();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);

  const [studentList, setStudentList] = useState([]);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [addStudentStatus, setAddStudentStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [minKillsForRandomize, setMinKillsForRandomize] = useState<string>("0");
  const [minKillsStatus, setMinKillsStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message?: string }>({ type: "idle" });
  let data: Student[] = studentList;

  const navDashboard = () => {
    navigate("/");
  };

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: "username", //access nested data with dot notation
        header: "Username",
        size: 150,
        enableEditing: false,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        enableEditing: true,
      },
      {
        accessorKey: "target",
        header: "Target",
        size: 150,
        enableEditing: true,
      },
      {
        accessorKey: "targetStatus",
        header: "Target Status",
        size: 150,
        enableEditing: true,
      },
      {
        accessorKey: "assassin",
        header: "Assassin",
        size: 150,
        enableEditing: true,
      },
      {
        accessorKey: "killCount",
        header: "Kill Count",
        size: 150,
        enableEditing: true,
      },
    ],
    []
  );
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

  useEffect(() => {
    refreshStudentList();
  }, []);

  const username = student ? student.username : "Loading...";

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableEditing: true,
    editDisplayMode: "modal",
    onEditingRowSave: async ({ values, table }) => {
      console.log("Values being sent:", values);
      try {
        const validStatuses = [
          "alive",
          "pending",
          "eliminated",
          "disqualified",
          "dispute",
        ];
        if (!validStatuses.includes(values.status)) {
          alert("Wrong status entered");
          return;
        }

        const killCountInt = parseInt(values.killCount, 10);
        if (isNaN(killCountInt) || killCountInt < 0) {
          alert("Invalid kill count entered");
          return;
        }
        await fetch("/api/updateStudentStatus", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            username: values.username,
            status: values.status,
            target: values.target,
            targetStatus: values.targetStatus,
            assassin: values.assassin,
            killCount: values.killCount,
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log("Status updated:", data))
          .catch((error) => console.error("Error updating status:", error));
        table.setEditingRow(null);
      } catch (error) {
        console.error("Catch error:", error); // Log any additional errors
      }
    },
  });

  const refreshStudentList = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    };

    console.log("Calling fetch....");
    fetch("/api/getStudentList", requestOptions)
      .then((response) => response.json())
      .then((data) => setStudentList(data.studentList));
  };

  const initialize = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    };

    console.log("Calling fetch....");
    fetch("/api/initialize", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.message?.includes("successful")) refreshStudentList();
      });
  };

  const randomizeTargets = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    };

    console.log("Calling fetch....");
    fetch("/api/randomizeTargets", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.message?.includes("successful")) refreshStudentList();
      });
  };

  const randomizeTargetsMinKills = () => {
    const n = parseInt(minKillsForRandomize, 10);
    if (Number.isNaN(n) || n < 0) {
      setMinKillsStatus({ type: "error", message: "Enter a non-negative number" });
      return;
    }
    setMinKillsStatus({ type: "loading" });
    fetch("/api/randomizeTargetsMinKills", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ minKills: n }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok && data.message?.includes("successful")) {
          setMinKillsStatus({ type: "success", message: `Randomized ${data.count} players with kills > ${n}` });
          refreshStudentList();
        } else {
          setMinKillsStatus({ type: "error", message: data.message || "Failed to randomize" });
        }
      })
      .catch(() => setMinKillsStatus({ type: "error", message: "Request failed" }));
  };

  const addStudent = async () => {
    const email = newStudentEmail.trim();
    if (!email) {
      setAddStudentStatus({ type: "error", message: "Enter an email address" });
      return;
    }
    setAddStudentStatus({ type: "loading" });
    const requestUrl = `${window.location.origin}/api/addStudent`;
    // #region agent log
    fetch('http://127.0.0.1:7430/ingest/e1caa617-2833-45b8-96c0-2bf47019711e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0d35c5'},body:JSON.stringify({sessionId:'0d35c5',location:'Admin.tsx:addStudent',message:'addStudent request',data:{requestUrl,origin:window.location.origin},timestamp:Date.now(),hypothesisId:'H_request_url'})}).catch(()=>{});
    // #endregion
    try {
      const response = await fetch("/api/addStudent", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      // #region agent log
      fetch('http://127.0.0.1:7430/ingest/e1caa617-2833-45b8-96c0-2bf47019711e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0d35c5'},body:JSON.stringify({sessionId:'0d35c5',location:'Admin.tsx:addStudent',message:'addStudent response',data:{status:response.status,statusText:response.statusText,url:response.url,ok:response.ok},timestamp:Date.now(),hypothesisId:'H_response_status'})}).catch(()=>{});
      // #endregion
      const data = await response.json();
      if (!response.ok) {
        setAddStudentStatus({
          type: "error",
          message: data.message || "Failed to add student",
        });
        return;
      }
      setAddStudentStatus({ type: "success", message: "Student added" });
      setNewStudentEmail("");
      refreshStudentList();
    } catch (err) {
      setAddStudentStatus({
        type: "error",
        message: "Request failed. Try again.",
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <h1 className="app-name">ASSASSIN</h1>
        <button className="button" onClick={navDashboard}>
          Dashboard
        </button>
        <div className="username">{username}</div>
      </nav>
      <div className="body-wrapper">
        <h2 className="pageTitle">Admin</h2>
        <br></br>
        {/* <button className="button" onClick={refreshStudentList}>
          Refresh
        </button> */}
        <button className="button" onClick={initialize}>
          Initialize
        </button>
        <button className="button" onClick={randomizeTargets}>
          Randomize
        </button>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.5rem" }}>
          <label style={{ fontSize: "0.95rem" }}>Randomize only players with kills &gt;</label>
          <input
            type="number"
            min={0}
            value={minKillsForRandomize}
            onChange={(e) => setMinKillsForRandomize(e.target.value)}
            style={{
              width: "4rem",
              padding: "0.35rem 0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            className="button"
            onClick={randomizeTargetsMinKills}
            disabled={minKillsStatus.type === "loading"}
          >
            {minKillsStatus.type === "loading" ? "Randomizing…" : "Randomize (kills > n)"}
          </button>
        </div>
        {minKillsStatus.type === "success" && (
          <p style={{ color: "green", marginTop: "0.25rem", marginBottom: 0 }}>{minKillsStatus.message}</p>
        )}
        {minKillsStatus.type === "error" && (
          <p style={{ color: "crimson", marginTop: "0.25rem", marginBottom: 0 }}>{minKillsStatus.message}</p>
        )}
        <br></br>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
            Add individual student
          </h3>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="e.g. 26username@students.harker.org"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStudent()}
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "1rem",
                minWidth: "280px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              className="button"
              onClick={addStudent}
              disabled={addStudentStatus.type === "loading"}
            >
              {addStudentStatus.type === "loading" ? "Adding…" : "Add student"}
            </button>
          </div>
          {addStudentStatus.type === "success" && (
            <p style={{ color: "green", marginTop: "0.5rem", marginBottom: 0 }}>
              {addStudentStatus.message}
            </p>
          )}
          {addStudentStatus.type === "error" && (
            <p style={{ color: "crimson", marginTop: "0.5rem", marginBottom: 0 }}>
              {addStudentStatus.message}
            </p>
          )}
        </div>
        <br></br>
        <div className="adminTable">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </>
  );
}
export default Admin;
