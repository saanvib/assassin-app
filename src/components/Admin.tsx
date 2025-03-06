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
        console.log("Session Token:", sessionToken);
        if (
          values.status == "alive" ||
          values.status == "pending" ||
          values.status == "eliminated" ||
          values.status == "disqualified" ||
          values.status == "dispute"
        ) {
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
              assasin: values.assassin,
              killCount: values.killCount,
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log("Status updated:", data))
            .catch((error) => console.error("Error updating status:", error));
          table.setEditingRow(null);
        } else {
          alert("wrong status entered");
        }
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
      .then((data) => setStudentList(data.studentList));
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
      .then((data) => setStudentList(data.studentList));
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
        <br></br>
        <div className="adminTable">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </>
  );
}
export default Admin;
