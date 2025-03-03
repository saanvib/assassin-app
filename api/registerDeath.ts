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
         if (studentObj.status == "pending" && assassinObj.targetStatus == "pending") {
            // then this student can die
            studentObj.status = "eliminated";
            statusMsg = "Kill registered. You are dead.";
            assassinObj.killCount += 1;
            // then reassign assassin to new target
            assassinObj.target = studentObj.target;
            assassinObj.targetStatus = "alive";
         }
         else {
            // student cannot die, throw error status msg
            status = 403;
            statusMsg = "The assassin has not reported their kill yet."
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
                        { key: studentUsername, operation: "update", value: studentObj }, { key: assassin, operation: "update", value: assassinObj }
                     ],
                  }),
               },
            );
            const result = await updateEdgeConfig.json();
            console.log(result);
         } catch (error) {
            console.log(error);
         }

      } catch (error) {
         console.log("Could not validate user session " + error);
      }
   } catch (error) {
      console.log("failed to initialize: " + error)
   }

   return res.json({
      message: statusMsg,
      statusCode: status,
      studentObj: studentObj,
   })
}