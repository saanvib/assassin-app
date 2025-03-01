import { getAll } from '@vercel/edge-config';
import type { VercelRequest, VercelResponse } from '@vercel/node'
import DescopeClient from '@descope/node-sdk';
import {Student} from '../src/components/utils/studentType.tsx';

// returns top 10 users with their kill count
// {[{name:username, count:count}]}
export default async function handler(req: VercelRequest, res: VercelResponse) {
   const { headers } = req;
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";

   const studentList: Student[] = [];
   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      try {
         const authInfo = await descopeClient.validateSession(sessionToken);
         console.log(authInfo);
         console.log("Successfully validated user session:");
         const roles: string[] = authInfo.token.roles as unknown as string[];
         
         if (roles.includes("admin")) {
            const configItems = await getAll();
            console.log("config Items " + configItems);
            for (const item in configItems) {
               const student = configItems[item] as unknown as Student;
               studentList.push(student);
            }
         }

      } catch (error) {
         console.log("Could not validate user session " + error);
      }
   } catch (error) {
      console.log("failed to initialize: " + error)
   }

   console.log(studentList);
   return res.json({
      studentList: studentList,
   })
}