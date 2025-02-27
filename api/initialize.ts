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
   const users = ["25SummerA@students.harker.org", "25MayaA@students.harker.org",
      "25SavyaA@students.harker.org",
      "25ClaireA@students.harker.org",
      "25KylieA@students.harker.org",
      "25HadenA@students.harker.org",
      "25RajasA@students.harker.org",
      "25SohumA@students.harker.org",
      "25RayanA@students.harker.org",
      "25TejA@students.harker.org",
      "25VedantB@students.harker.org",
      "25ShivenB@students.harker.org",
      "25AaronB@students.harker.org",
      "25OskarB@students.harker.org",
      "25AryanaB@students.harker.org",
      "25SaanviB@students.harker.org",
      "25SanaaB@students.harker.org",
      "25VarunB@students.harker.org",
      "25ReiB@students.harker.org",
      "25FernB@students.harker.org",
      "25MarcusB@students.harker.org",
      "25AaravB@students.harker.org",
      "25StephanieB@students.harker.org",
      "25AngelinaB@students.harker.org",
      "25IrisC@students.harker.org",
      "25CaioC@students.harker.org",
      "25ShreyasC@students.harker.org",
      "25GemmaC@students.harker.org",
      "25AaronC@students.harker.org",
      "25AinslieC@students.harker.org",
      "25BellaC@students.harker.org", "25DanielC@students.harker.org",
   ]
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
   const assassinAppConfig = createClient(process.env.EDGE_CONFIG);
   const edge_config_id = process.env.EDGE_CONFIG_ID;
   let target: string = "";


   const studentList: Student[] = [];
   for (const user in users) {
      const username = users[user].split("@")[0];
      studentList.push({
         "username": username,
         "killCount": 0,
         "absences": [],
         "assassin": "",
         "status": "alive",
         "target": "",
         "targetStatus": "alive"
      })
   }

   const items: any[] = [];
   for (const student in studentList) {
      items.push({ key: studentList[student].username, operation: "create", value: studentList[student] });
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



   return res.json({

   })
}