import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, get, getAll } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';
import { Student } from '../src/components/utils/studentType';


function shuffle(array) {
   let currentIndex = array.length;
   while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
         array[randomIndex], array[currentIndex]];
   }
}

function createChain(studentListCopy) {
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

      const items: any[] = [];

      // first kill everybody in pending TODO: change?
      for (const student in studentList) {
         if (studentList[student].status == "pending") {
            return res.json({message: "cannot randomize - pending users"});
         }
         if (studentList[student].targetStatus == "pending") {
            return res.json({message: "cannot randomize - pending users"});
         }
         if (studentList[student].status == "alive" && studentList[student].killCount == 0) {
            studentList[student].status = "eliminated";
         }

         if (studentList[student].status == "alive" && studentList[student].killCount > 0) {
            studentListCopy.push(studentList[student]);
         } else {
            items.push({ key: studentList[student].username, operation: "update", value: studentList[student] })
         }
      }

      shuffle(studentListCopy);
      createChain(studentListCopy);

      for (const student in studentListCopy) {
         items.push({ key: studentListCopy[student].username, operation: "update", value: studentListCopy[student] });
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


   res.json({ message: "initialize successful" });
   return res;
}