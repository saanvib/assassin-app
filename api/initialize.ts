import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAll } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';
import { Student } from '../src/components/utils/studentType';

export default async function GET(req: VercelRequest, res: VercelResponse) {
   const { headers } = req;
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
   const edge_config_id = process.env.EDGE_CONFIG_ID;
   const items: { key: string; operation: string; value: Student }[] = [];

   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      try {
         const authInfo = await descopeClient.validateSession(sessionToken);
         console.log(authInfo);
         console.log("Successfully validated user session:");
         const roles: string[] = authInfo.token.roles as unknown as string[];

         if (roles.includes("admin")) {
            const configItems = await getAll();
            for (const key in configItems) {
               const existing = configItems[key] as unknown as Student;
               const username = typeof existing?.username === "string" ? existing.username : key;
               const resetStudent: Student = {
                  username,
                  killCount: 0,
                  assassin: "",
                  status: "alive",
                  target: "",
                  targetStatus: "alive",
               };
               items.push({ key: username, operation: "upsert", value: resetStudent });
            }

            if (items.length === 0) {
               res.json({ message: "initialize successful (no students in Edge Config to reset)" });
               return res;
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
               console.log(result);
               if (!updateEdgeConfig.ok) {
                  res.status(502).json({ message: "Edge Config update failed", details: result });
                  return res;
               }
            } catch (error) {
               console.log(error);
               res.status(502).json({ message: "Edge Config update error", error: String(error) });
               return res;
            }
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
   res.json({ message: "initialize successful", count: items.length });
   return res;
}

