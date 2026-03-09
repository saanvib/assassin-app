import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAll } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';
import { Student } from '../src/components/utils/studentType';

function shuffle(array: any[]) {
   let currentIndex = array.length;
   while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
         array[randomIndex], array[currentIndex]];
   }
}

function createChain(studentListCopy: Student[]) {
   for (let i = 0; i < studentListCopy.length; i++) {
      if (i === 0) {
         studentListCopy[i].target = studentListCopy[i + 1].username;
         studentListCopy[i].assassin = studentListCopy[studentListCopy.length - 1].username;
         studentListCopy[i].targetStatus = "alive";
      } else if (i === studentListCopy.length - 1) {
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

export default async function POST(req: VercelRequest, res: VercelResponse) {
   if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
   }

   const { headers, body } = req;
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
   const edge_config_id = process.env.EDGE_CONFIG_ID;

   let minKills: number;
   try {
      const n = body?.minKills;
      if (typeof n !== "number" && typeof n !== "string") {
         return res.status(400).json({ message: "minKills (number) required in body" });
      }
      minKills = typeof n === "string" ? parseInt(n, 10) : n;
      if (Number.isNaN(minKills) || minKills < 0) {
         return res.status(400).json({ message: "minKills must be a non-negative number" });
      }
   } catch {
      return res.status(400).json({ message: "Invalid request body" });
   }

   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      const authInfo = await descopeClient.validateSession(sessionToken);
      const roles: string[] = authInfo.token.roles as unknown as string[];
      if (!roles.includes("admin")) {
         return res.status(403).json({ message: "Admin required" });
      }
   } catch (error) {
      console.log("Could not validate user session", error);
      return res.status(500).json({ message: "Could not validate user session " + error });
   }

   const configItems = await getAll();
   const studentList: Student[] = [];
   for (const key in configItems) {
      studentList.push(configItems[key] as unknown as Student);
   }

   for (const student of studentList) {
      if (student.status === "pending" || student.targetStatus === "pending") {
         return res.status(400).json({ message: "Cannot randomize - pending users or target status" });
      }
   }

   const inChain: Student[] = [];
   const items: { key: string; operation: string; value: Student }[] = [];

   for (const student of studentList) {
      if (student.status === "alive" && student.killCount > minKills) {
         inChain.push(student);
      } else {
         items.push({ key: student.username, operation: "update", value: student });
      }
   }

   if (inChain.length < 2) {
      return res.status(400).json({
         message: inChain.length === 0
            ? `No alive players with kill count > ${minKills}`
            : `Need at least 2 alive players with kill count > ${minKills}`,
      });
   }

   shuffle(inChain);
   createChain(inChain);
   for (const student of inChain) {
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
            body: JSON.stringify({ items }),
         },
      );
      const result = await updateEdgeConfig.json();
      if (!updateEdgeConfig.ok) {
         console.error("Edge Config update failed:", result);
         return res.status(502).json({ message: "Edge Config update failed", details: result });
      }
   } catch (error) {
      console.log(error);
      return res.status(502).json({ message: "Edge Config update failed", error: String(error) });
   }

   return res.json({ message: "randomize successful", count: inChain.length });
}
