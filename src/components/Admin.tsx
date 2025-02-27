import { useMemo, useState } from "react";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, get, getAll } from "@vercel/edge-config";
import DescopeClient from "@descope/node-sdk";

// ROL2tYLDLHCrNHHpMCmKpK055vS10N admin ID
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

interface Student {
  username: string;
  killCount: number;
  absences: string[];
  assassin: string;
  status: string;
  target: string;
  targetStatus: string;
}

// async function handler(req: VercelRequest, res: VercelResponse) {
//   const { headers } = req;
//   const bearerToken: string = headers.authorization ?? "";
//   const sessionToken: string = bearerToken.split(" ")[1];
//   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
//   const assassinAppConfig = createClient(process.env.EDGE_CONFIG);
//   const edge_config_id = process.env.EDGE_CONFIG_ID;

//   console.log(sessionToken);
//   try {
//     const descopeClient = DescopeClient({ projectId: descopeProjectId });
//     try {
//       const authInfo = await descopeClient.validateSession(sessionToken);
//       console.log("Successfully validated user session:");

//       console.log(authInfo.token);

//       const email: string = authInfo.token.email as string;
//       const studentUsername = email.split("@")[0];
//       // Fetch a single value from one config
//     } catch (error) {
//       console.log("Could not validate user session " + error);
//     }
//   } catch (error) {
//     console.log("failed to initialize: " + error);
//   }
// }

function Admin() {
  const [studentList, setStudentList] = useState([]);
  const cols = ["username", "status"];

  let data: Student[] = studentList;
  let columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: "username", //access nested data with dot notation
        header: "Username",
        size: 150,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
      },
    ],
    []
  );

  let table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });
  const refreshStudentList = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("Calling fetch....");
    fetch("/api/getStudentList", requestOptions)
      .then((response) => response.json())
      .then((data) => setStudentList(data.studentList));

    columns = useMemo<MRT_ColumnDef<Student>[]>(
      () => [
        {
          accessorKey: "username", //access nested data with dot notation
          header: "Username",
          size: 150,
        },
        {
          accessorKey: "status",
          header: "Status",
          size: 150,
        },
      ],
      []
    );

    table = useMaterialReactTable({
      columns,
      data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      enableEditing: true,
    });
  };

  const initialize = () => {
    const requestOptions = {
      method: "POST",
      headers: {
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
        <div className="username">Username</div>
      </nav>
      <div className="body-wrapper">
        Admin
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
        <MaterialReactTable table={table} />
      </div>
    </>
  );
}
export default Admin;
