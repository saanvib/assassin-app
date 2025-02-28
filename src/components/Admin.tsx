import { useMemo, useState } from "react";
import { getSessionToken } from "@descope/react-sdk";

// ROL2tYLDLHCrNHHpMCmKpK055vS10N admin ID
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useNavigate } from "react-router-dom";

interface Student {
  username: string;
  killCount: number;
  absences: string[];
  assassin: string;
  status: string;
  target: string;
  targetStatus: string;
}

function Admin() {
  const sessionToken = getSessionToken();
  const navigate = useNavigate();

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
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableEditing: true,
    editDisplayMode: "modal",
    onEditingRowSave: async ({ values, table }) => {
      console.log("Values being sent:", values);
      try {
        console.log("Session Token:", sessionToken);
        await fetch("/api/updateStudentStatus", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            username: values.username,
            status: values.status,
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
      method: "POST",
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
      method: "POST",
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
      method: "POST",
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
        <div className="username">Username</div>
      </nav>
      <div className="body-wrapper">
        <h1>Admin</h1>
        <br></br>
        <button className="button" onClick={refreshStudentList}>
          Refresh
        </button>
        <button className="button" onClick={initialize}>
          Initialize
        </button>
        <button className="button" onClick={randomizeTargets}>
          Randomize
        </button>
        <br></br>
        <MaterialReactTable table={table} />
      </div>
    </>
  );
}
export default Admin;
