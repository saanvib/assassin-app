import { createClient, get } from '@vercel/edge-config';
import type { VercelRequest, VercelResponse } from '@vercel/node'
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
   let status = 200;
   let statusMsg = "OK";
   let studentObj: any = null;
   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      try {
         const authInfo = await descopeClient.validateSession(sessionToken);
         console.log("Successfully validated user session:");
         const email: string = authInfo.token.email as string;
         const allData = await assassinAppConfig.getAll();

         const studentUsername = email.split("@")[0];
         // Fetch a single value from one config
         studentObj = await assassinAppConfig.get(studentUsername) as unknown as Student;

      } catch (error) {
         console.log("Could not validate user session " + error);
      }
   } catch (error) {
      console.log("failed to initialize: " + error)
   }   
   console.log(studentObj.username);
   console.log("student obj is " + studentObj);
   return res.json({
      studentObj: studentObj,
   })
}