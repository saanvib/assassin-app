import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, get } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';



export default async function POST(req: VercelRequest, res: VercelResponse) {
   const { headers } = req;
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
   const assassinAppConfig = createClient(process.env.EDGE_CONFIG);
   const edge_config_id = process.env.EDGE_CONFIG_ID;
   let status = 200;
   let statusMsg = "OK";
   let assassin: string = "";
   let studentObj: any;
   let studentInfo: any = {};
   console.log(sessionToken);
   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      try {
         const authInfo = await descopeClient.validateSession(sessionToken);
         console.log("Successfully validated user session:");
         const email: string = authInfo.token.email as string;
         const studentUsername = email.split("@")[0].toLowerCase();
         // Fetch a single value from one config
         studentObj = await assassinAppConfig.get(studentUsername);
         assassin = studentObj.assassin;
         const assassinObj: any = await assassinAppConfig.get(assassin);
         const targetUsername = studentObj.target;
         const targetObj: any = await assassinAppConfig.get(targetUsername);

         if (studentObj.status == "pending" && assassinObj.targetStatus == "pending") {
            // then this student can die
            studentObj.status = "eliminated";
            statusMsg = "Kill registered. You are dead.";
            assassinObj.killCount = parseInt(assassinObj.killCount) + 1;
            // then reassign assassin to new target
            assassinObj.target = studentObj.target;
            assassinObj.targetStatus = "alive";
            targetObj.assassin = studentObj.assassin;
         }
         else {
            // student cannot die, throw error status msg
            status = 403;
            statusMsg = "The assassin has not reported their kill yet."
            return res.json({
               message: statusMsg,
               statusCode: status
            });
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
                     items: [
                        { key: studentUsername, operation: "update", value: studentObj }, { key: assassin, operation: "update", value: assassinObj }, { key: targetUsername, operation: "update", value: targetObj }
                     ],
                  }),
               },
            );
            const result = await updateEdgeConfig.json();

            studentInfo.username = studentObj.username;
            studentInfo.target = studentObj.target;
            studentInfo.targetStatus = studentObj.targetStatus;
            studentInfo.killCount = studentObj.killCount;
            studentInfo.status = studentObj.status;

         } catch (error) {
            console.log(error);
            res.status(500);
            res.json({ message: "UPDATE FAILED " + error });
            return res;
         }

      } catch (error) {
         console.log("Could not validate user session " + error);
         res.status(500);
         res.json({ message: "ERROR: Could not validate user session " + error });
         return res;
      }
   } catch (error) {
      console.log("failed to initialize: " + error)
      res.status(500);
      res.json({ message: "ERROR: failed to initialize: " + error });
      return res;
   }


   return res.json({
      message: statusMsg,
      statusCode: status,
      studentObj: studentInfo,
   });
}