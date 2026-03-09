import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, get, getAll } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';
import { Student } from '../src/components/utils/studentType';


function shuffle(array: any[]) {
   let currentIndex = array.length;
   while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
         array[randomIndex], array[currentIndex]];
   }
}

function createChain(studentListCopy: any[]) {
   for (let i = 0; i < studentListCopy.length; i++) {
      if (i == 0) {
         studentListCopy[i].target = studentListCopy[i + 1].username;
         studentListCopy[i].assassin =
            studentListCopy[studentListCopy.length - 1].username;
         studentListCopy[i].targetStatus = "alive";
      } else if (i == studentListCopy.length - 1) {
         studentListCopy[i].target = studentListCopy[0].username;
         studentListCopy[i].assassin = studentListCopy[i - 1].username;
         studentListCopy[i].targetStatus = "alive";
      } else {
         studentListCopy[i].target = studentListCopy[i + 1].username;
         studentListCopy[i].assassin = studentListCopy[i - 1].username;
         studentListCopy[i].targetStatus = "alive";
      }
   }
}


export default async function GET(req: VercelRequest, res: VercelResponse) {
   const { headers } = req;
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
   const assassinAppConfig = createClient(process.env.EDGE_CONFIG);
   const edge_config_id = process.env.EDGE_CONFIG_ID;
   let target: string = "";
   const configItems = await getAll();
   const studentList: Student[] = [];
   const studentListCopy: Student[] = [];
   const isValidCron: boolean = (sessionToken == process.env.CRON_SECRET);
   let isValidUser: boolean = false;
   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      try {
         const authInfo = await descopeClient.validateSession(sessionToken);
         console.log(authInfo);
         console.log("Successfully validated user session:");
         const roles: string[] = authInfo.token.roles as unknown as string[];

         if (roles.includes("admin")) {
            isValidUser = true;
         }

      } catch (error) {
         console.log("Could not validate user session " + error);
         res.status(500);
         res.json({ message: "Could not validate user session " + error });
         return res;
      }
   } catch (error) {
      console.log("failed to initialize: " + error)
      res.status(500);
      res.json({ message: "failed to initialize: " + error });
      return res;
   }

   if (isValidUser) {
      for (const item in configItems) {
         const student = configItems[item] as unknown as Student;
         studentList.push(student);
      }
      const availTargets = Array<number>(studentList.length).fill(1); // 1 = avail 0 = not
      console.log(availTargets);

      let items: any[] = [];

      // Block if any user is pending (disputes etc.)
      for (const student of studentList) {
         if (student.status === "pending") {
            return res.status(400).json({ message: "Cannot randomize - pending users" });
         }
         if (student.targetStatus === "pending") {
            return res.status(400).json({ message: "Cannot randomize - pending target status" });
         }
      }

      // Include all alive players in the chain (any kill count)
      for (const student of studentList) {
         if (student.status === "alive") {
            studentListCopy.push(student);
         } else {
            items.push({ key: student.username, operation: "update", value: student });
         }
      }

      if (studentListCopy.length < 2) {
         return res.status(400).json({
            message: studentListCopy.length === 0
               ? "No alive players to randomize"
               : "Need at least 2 alive players to randomize",
         });
      }

      shuffle(studentListCopy);
      createChain(studentListCopy);

      for (const student of studentListCopy) {
         items.push({ key: student.username, operation: "update", value: student });
      }

      try {
         const updateEdgeConfig = await fetch(
            'https://api.vercel.com/v1/edge-config/' + edge_config_id + '/items',
            {
               method: 'PATCH',
               headers: {
                  Authorization: `Bearer ${process.env.ASSASSIN_APP_API_TOKEN}`,
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  items: items,
               }),
            },
         );
         const result = await updateEdgeConfig.json();
         console.log(result);
      } catch (error) {
         console.log(error);
         res.status(502).json({ message: "Edge Config update failed", error: String(error) });
         return res;
      }
   } else {
      res.status(403).json({ message: "Admin required" });
      return res;
   }

   res.json({ message: "randomize successful", count: studentListCopy.length });
   return res;
}
