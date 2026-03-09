import type { VercelRequest, VercelResponse } from '@vercel/node';
import DescopeClient from '@descope/node-sdk';
import { Student } from '../src/components/utils/studentType';

export default async function POST(req: VercelRequest, res: VercelResponse) {
   // #region agent log
   fetch('http://127.0.0.1:7430/ingest/e1caa617-2833-45b8-96c0-2bf47019711e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0d35c5'},body:JSON.stringify({sessionId:'0d35c5',location:'api/addStudent.ts:entry',message:'addStudent handler entered',data:{method:req?.method},timestamp:Date.now(),hypothesisId:'H_handler_invoked'})}).catch(()=>{});
   // #endregion
   if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
   }

   const { headers, body } = req;
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
   const edge_config_id = process.env.EDGE_CONFIG_ID;

   let email: string;
   try {
      email = typeof body?.email === "string" ? body.email.trim() : "";
   } catch {
      return res.status(400).json({ message: "Invalid request body" });
   }

   if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required" });
   }

   const username = email.split("@")[0].toLowerCase();

   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      const authInfo = await descopeClient.validateSession(sessionToken);
      const roles: string[] = authInfo.token.roles as unknown as string[];

      if (!roles.includes("admin")) {
         return res.status(403).json({ message: "Admin role required" });
      }

      const newStudent: Student = {
         username,
         killCount: 0,
         assassin: "",
         status: "alive",
         target: "",
         targetStatus: "alive",
      };

      const updateEdgeConfig = await fetch(
         'https://api.vercel.com/v1/edge-config/' + edge_config_id + '/items',
         {
            method: 'PATCH',
            headers: {
               Authorization: `Bearer ${process.env.ASSASSIN_APP_API_TOKEN}`,
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               items: [{ key: username, operation: "upsert", value: newStudent }],
            }),
         },
      );

      const result = await updateEdgeConfig.json();
      if (!updateEdgeConfig.ok) {
         console.error("Edge Config update failed:", result);
         return res.status(502).json({
            message: "Failed to add student to game roster",
            details: result,
         });
      }

      return res.status(200).json({
         message: "Student added successfully",
         student: newStudent,
      });
   } catch (error) {
      console.error("addStudent error:", error);
      return res.status(500).json({
         message: "Could not add student",
         error: String(error),
      });
   }
}
