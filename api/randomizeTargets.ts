import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, get, getAll } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';

interface Student {
   "username": string,
   "killCount": number,
   "absences": string[],
   "assassin": string,
   "status": string,
   "target": string,
   "targetStatus": string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
   const { headers } = req;
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
   const assassinAppConfig = createClient(process.env.EDGE_CONFIG);
   const edge_config_id = process.env.EDGE_CONFIG_ID;
   let target: string = "";
   const configItems = await getAll();
   const studentList: Student[] = [];

   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      try {
         const authInfo = await descopeClient.validateSession(sessionToken);
         console.log(authInfo);
         console.log("Successfully validated user session:");
         const roles: string[] = authInfo.token.roles as unknown as string[];

         if (roles.includes("admin")) {

            for (const item in configItems) {
               const student = configItems[item] as unknown as Student;
               studentList.push(student);
            }
            const availTargets = Array<number>(studentList.length).fill(1); // 1 = avail 0 = not
            console.log(availTargets);

            // first kill everybody in pending TODO: change?
            for (const student in studentList) {
               if (studentList[student].status == "pending") {
                  studentList[student].status = "eliminated";
               }
               if (studentList[student].targetStatus == "pending") {
                  studentList[student].targetStatus = "eliminated";
                  studentList[student].killCount += 1;
               }
            }

            // alive people get reassigned
            for (const student in studentList) {
               let done: boolean = false;
               while (studentList[student].status == "alive" && !done) {
                  const r = Math.floor(Math.random() * studentList.length);
                  if (r != Number(student) && availTargets[r] == 1) {
                     availTargets[r] = 0;
                     studentList[student].target = studentList[r].username;
                     studentList[r].assassin = studentList[student].username;
                     studentList[student].targetStatus = "alive";
                     done = true;
                  }
               }
            }

            console.log("student List" + studentList);

            const items: any[] = [];
            for (const student in studentList) {
               items.push({ key: studentList[student].username, operation: "update", value: studentList[student] });
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
            }

         }

      } catch (error) {
         console.log("Could not validate user session " + error);
      }
   } catch (error) {
      console.log("failed to initialize: " + error)
   }

   return res.json({
   })
}