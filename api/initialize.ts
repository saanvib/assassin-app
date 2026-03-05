import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, get, getAll } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';
import { Student } from '../src/components/utils/studentType';

export default async function GET(req: VercelRequest, res: VercelResponse) {
   const { headers } = req;
   // TODO: Update this array with class of 2026 student emails
   // Format: "26[username]@students.harker.org"
   // Example: "26clairey@students.harker.org"
   const users = [
      "26sathvikv@students.harker.org",
      "26krishn@students.harker.org",
      "26ruhib@students.harker.org",
      "26danielles@students.harker.org",
      "26katharinar@students.harker.org",
      "26arushis@students.harker.org",
      "26alejandroc@students.harker.org",
      "26shreyav@students.harker.org",
      "26anoushkac@students.harker.org",
      "26georgey@students.harker.org",
      "26yashg@students.harker.org",
      "26maryanned@students.harker.org",
      "26erikaw@students.harker.org",
      "26dishag@students.harker.org",
      "26brookek@students.harker.org",
      "26mendym@students.harker.org",
      "26leanaz@students.harker.org",
      "26eliea@students.harker.org",
      "26shimekas@students.harker.org",
      "26stanleyc@students.harker.org",
      "26danielw@students.harker.org",
      "26cyrusg@students.harker.org",
      "26sophiab@students.harker.org",
      "26emilyb@students.harker.org",
      "26sophiep@students.harker.org",
      "26ruhana@students.harker.org",
      "26kairuis@students.harker.org",
      "26serenal@students.harker.org",
      "26hubertl@students.harker.org",
      "26farhana@students.harker.org",
      "26laurab@students.harker.org",
      "26lindaz@students.harker.org",
      "26jonathans@students.harker.org",
      "26charliew@students.harker.org",
      "26christym@students.harker.org",
      "26anikaa@students.harker.org",
      "26yenay@students.harker.org",
      "26sammiel@students.harker.org",
      "26kimayam@students.harker.org",
      "26wenjiez@students.harker.org",
      "26alberty@students.harker.org",
      "26ishanm@students.harker.org",
      "26judia@students.harker.org",
      "26alans@students.harker.org",
      "26miak@students.harker.org",
      "26victoriam@students.harker.org",
      "26ayas@students.harker.org",
      "26celinax@students.harker.org",
      "26hannahl@students.harker.org",
      "26davidh@students.harker.org",
      "26andrewt@students.harker.org",
      "26evac@students.harker.org",
      "26natalieb@students.harker.org",
      "26nandinic@students.harker.org",
      "26beec@students.harker.org",
      "26joyh@students.harker.org",
      "26benjaminx@students.harker.org",
      "26jasmineh@students.harker.org",
      "26krishg@students.harker.org",
      "26terryx@students.harker.org",
      "26roshana@students.harker.org",
      "26voukp@students.harker.org",
      "26macenzieb@students.harker.org",
      "26arielz@students.harker.org",
      "26sidb@students.harker.org",
      "26rahuls@students.harker.org",
      "26parasp@students.harker.org",
      "26janamc@students.harker.org",
      "26mikhilk@students.harker.org",
      "26mindyt@students.harker.org",
      "26ashleym@students.harker.org",
      "26brennar@students.harker.org",
      "26sw@students.harker.org",
      "26ayaana@students.harker.org",
      "26tanvis@students.harker.org",
      "26lucasc@students.harker.org",
      "26alineg@students.harker.org",
      "26angelinaa@students.harker.org",
      "26kobyy@students.harker.org",
      "26sahilj@students.harker.org",
      "26demitria@students.harker.org",
      "26yashs@students.harker.org",
      "26ethanl@students.harker.org",
      "26charlottel@students.harker.org",
      "26adityar@students.harker.org",
      "26krisha@students.harker.org",
      "26mihirg@students.harker.org",
      "26allisonh@students.harker.org",
      "26celinal@students.harker.org",
      "26umairp@students.harker.org",
      "26veerazt@students.harker.org",
      "26katiet@students.harker.org",
      "26suhanab@students.harker.org",
      "26lukew@students.harker.org",
      "26rishaant@students.harker.org",
      "26lilys@students.harker.org",
      "26shainac@students.harker.org",
      "26stellay@students.harker.org",
      "26aaritg@students.harker.org",
      "26siddharths@students.harker.org",
      "26kimiy@students.harker.org",
      "26spencerc@students.harker.org",
      "26taran@students.harker.org",
      "26robinsonx@students.harker.org",
      "26adityas@students.harker.org",
      "26audreyy@students.harker.org",
      "26danielm@students.harker.org",
      "26minalj@students.harker.org",
      "26tiffanyz@students.harker.org",
      "26selinaw@students.harker.org",
      "26irisw@students.harker.org",
      "26alanab@students.harker.org",
      "26ritikr@students.harker.org",
      "26ellag@students.harker.org",
      "26luchoc@students.harker.org",
      "26nikhils@students.harker.org",
      "26katherinew@students.harker.org",
      "26ethanle@students.harker.org",
      "26michaelh@students.harker.org",
      "26carissaw@students.harker.org",
      "26jessicah@students.harker.org",
      "26emmal@students.harker.org",
      "26taylors@students.harker.org",
      "26amanc@students.harker.org",
      "26davidl@students.harker.org",
      "26cadenr@students.harker.org",
      "26samuelt@students.harker.org",
      "26alang@students.harker.org",
      "26bradyt@students.harker.org",
      "26justiny@students.harker.org",
      "26jamesli@students.harker.org",
      "26ankitac@students.harker.org",
      "26suhanig@students.harker.org",
      "26lucyc@students.harker.org",
      "26eddiez@students.harker.org",
      "26aliciay@students.harker.org",
      "26annaw@students.harker.org",
      "26heleng@students.harker.org",
      "26natt@students.harker.org",
      "26anikar@students.harker.org",
      "26arturov@students.harker.org",
      "26danikag@students.harker.org",
      "26ananyag@students.harker.org",
      "26sophiao@students.harker.org",
      "26kalliew@students.harker.org",
      "26sofias@students.harker.org",
   ]
   const bearerToken: string = headers.authorization ?? "";
   const sessionToken: string = bearerToken.split(" ")[1];
   const descopeProjectId: string = process.env.DESCOPE_PROJECT ?? "";
   const assassinAppConfig = createClient(process.env.EDGE_CONFIG);
   const edge_config_id = process.env.EDGE_CONFIG_ID;
   let target: string = "";
   const items: any[] = [];


   try {
      const descopeClient = DescopeClient({ projectId: descopeProjectId });
      try {
         const authInfo = await descopeClient.validateSession(sessionToken);
         console.log(authInfo);
         console.log("Successfully validated user session:");
         const roles: string[] = authInfo.token.roles as unknown as string[];

         if (roles.includes("admin")) {
            const studentList: Student[] = [];
            for (const user in users) {
               const username = users[user].split("@")[0].toLowerCase();
               studentList.push({
                  "username": username,
                  "killCount": 0,
                  "assassin": "",
                  "status": "alive",
                  "target": "",
                  "targetStatus": "alive"
               })
            }

            for (const student in studentList) {
               items.push({ key: studentList[student].username, operation: "upsert", value: studentList[student] });
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
   res.json({ message: "initialize successful" });
   return res;
}

