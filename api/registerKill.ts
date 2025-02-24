import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, get } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';



export default async function handler(req: VercelRequest, res: VercelResponse) {
   const { headers } = req;
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
   const assassinAppConfig = createClient(process.env.EDGE_CONFIG);
   const edge_config_id = process.env.EDGE_CONFIG_ID;
   let target: string = "";
   console.log(sessionToken);
   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      try {
         const authInfo = await descopeClient.validateSession(sessionToken);
         console.log("Successfully validated user session:");
         const email: string = authInfo.token.email as string;
         const studentUsername = email.split("@")[0];
         // Fetch a single value from one config
         const studentObj: any = await assassinAppConfig.get(studentUsername);
         target = studentObj.target;
         const targetObj: any = await assassinAppConfig.get(target);
         studentObj.targetStatus = "pending";
         targetObj.status = "pending";
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
                        { key: studentUsername, operation: "update", value: studentObj }, { key: target, operation: "update", value: targetObj }
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
      message: `${target} has been killed!`,
   })
}