import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, get } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';

export default async function PATCH(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { headers, body } = req;

  let username, status;
  try {
    ({ username, status } = body);
    console.log("Parsed body:", { username, status });
  } catch (error) {
     console.error("Error parsing body:", error);
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  const bearerToken: string = headers.authorization ?? "";
  const sessionToken: string = bearerToken.split(" ")[1];

  const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
  const assassinAppConfig = createClient(process.env.EDGE_CONFIG);
  const edge_config_id = process.env.EDGE_CONFIG_ID;

  console.log(sessionToken);
  try {
    const descopeClient = DescopeClient({ projectId: descopeProjectId });
    const authInfo = await descopeClient.validateSession(sessionToken);

    console.log("Successfully validated user session:");
    const studentUsername = username;
    const studentObj: any = await assassinAppConfig.get(studentUsername);
    if (!studentObj) {
      return res.status(404).json({ message: "Student not found" });
    }

    studentObj.status = status;

    const updateEdgeConfig = await fetch(
      `https://api.vercel.com/v1/edge-config/${edge_config_id}/items`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.ASSASSIN_APP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ key: studentUsername, operation: "update", value: studentObj }],
        }),
      }
    );

    return res.json({ message: "OK", statusCode: 200 });
  } catch (error) {
    console.error("Error:", error);
  }
}