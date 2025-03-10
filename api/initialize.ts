import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, get, getAll } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';
import { Student } from '../src/components/utils/studentType';

export default async function GET(req: VercelRequest, res: VercelResponse) {
   const { headers } = req;
   const users = ["25aaravb@students.harker.org",
      "25aaronb@students.harker.org",
      "25aaronc@students.harker.org",
      "25aarong@students.harker.org",
      "25aarushv@students.harker.org",
      "25abigails@students.harker.org",
      "25abbyl@students.harker.org",
      "25adamp@students.harker.org",
      "25advaym@students.harker.org",
      "25agastyar@students.harker.org",
      "25aidanw@students.harker.org",
      "25ainsliec@students.harker.org",
      "25aishanis@students.harker.org",
      "25akulg@students.harker.org",
      "25alecz@students.harker.org",
      "25alexz@students.harker.org",
      "25aliciar@students.harker.org",
      "25alisony@students.harker.org",
      "25allisony@students.harker.org",
      "25ananyad@students.harker.org",
      "25andrel@students.harker.org",
      "25andrewl@students.harker.org",
      "25andyc@students.harker.org",
      "25angelinab@students.harker.org",
      "25anikap@students.harker.org",
      "25anwenh@students.harker.org",
      "25arianag@students.harker.org",
      "25arjens@students.harker.org",
      "25arthurw@students.harker.org",
      "25aryanab@students.harker.org",
      "25atharvg@students.harker.org",
      "25audreyc@students.harker.org",
      "25audreyf@students.harker.org",
      "25austinl@students.harker.org",
      "25avaynag@students.harker.org",
      "25averyj@students.harker.org",
      "25bahars@students.harker.org",
      "25bellac@students.harker.org",
      "25bhavyas@students.harker.org",
      "25bowenx@students.harker.org",
      "25brendonh@students.harker.org",
      "25caioc@students.harker.org",
      "25caitlynw@students.harker.org",
      "25calebt@students.harker.org",
      "25charlief@students.harker.org",
      "25charlizew@students.harker.org",
      "25chaycem@students.harker.org",
      "25kaih@students.harker.org",
      "25chilingh@students.harker.org",
      "25cindyy@students.harker.org",
      "25clairea@students.harker.org",
      "25clairec@students.harker.org",
      "25clairep@students.harker.org",
      "25clairez@students.harker.org",
      "25danield@students.harker.org",
      "25danielg@students.harker.org",
      "25danielc@students.harker.org",
      "25deeyav@students.harker.org",
      "25emilym@students.harker.org",
      "25emilys@students.harker.org",
      "25emmam@students.harker.org",
      "25kaiyueg@students.harker.org",
      "25ethanw@students.harker.org",
      "25eval@students.harker.org",
      "25felixc@students.harker.org",
      "25fernb@students.harker.org",
      "25garyj@students.harker.org",
      "25gemmac@students.harker.org",
      "25genievem@students.harker.org",
      "25giae@students.harker.org",
      "25granty@students.harker.org",
      "25hadena@students.harker.org",
      "25hannahl@students.harker.org",
      "25hannahs@students.harker.org",
      "25hanyangs@students.harker.org",
      "25harrisonc@students.harker.org",
      "25harrissm@students.harker.org",
      "25hasinin@students.harker.org",
      "25himat@students.harker.org",
      "25iang@students.harker.org",
      "25irisc@students.harker.org",
      "25isabellal@students.harker.org",
      "25jacobs@students.harker.org",
      "25jacquelineh@students.harker.org",
      "25jasons@students.harker.org",
      "25jasony@students.harker.org",
      "25jeffreyz@students.harker.org",
      "25jessicawa@students.harker.org",
      "25jiajiaj@students.harker.org",
      "25jonathanw@students.harker.org",
      "25jonnyx@students.harker.org",
      "25julianal@students.harker.org",
      "25kaitlyns@students.harker.org",
      "25kalebg@students.harker.org",
      "25kashishp@students.harker.org",
      "25katerinam@students.harker.org",
      "25kerene@students.harker.org",
      "25keshavk@students.harker.org",
      "25khanhlinht@students.harker.org",
      "25kylel@students.harker.org",
      "25kyliea@students.harker.org",
      "25kyrac@students.harker.org",
      "25laurenl@students.harker.org",
      "25leos@students.harker.org",
      "25liamj@students.harker.org",
      "25liannaw@students.harker.org",
      "25lindseyt@students.harker.org",
      "25lukez@students.harker.org",
      "25marcusb@students.harker.org",
      "25maxz@students.harker.org",
      "25mayaa@students.harker.org",
      "25maziarz@students.harker.org",
      "25melodyy@students.harker.org",
      "25mirabellef@students.harker.org",
      "25naiyad@students.harker.org",
      "25nataliel@students.harker.org",
      "25navyas@students.harker.org",
      "25neilk@students.harker.org",
      "25nelsong@students.harker.org",
      "25nikhilp@students.harker.org",
      "25nolanc@students.harker.org",
      "25norahm@students.harker.org",
      "25oliverr@students.harker.org",
      "25oliviag@students.harker.org",
      "25oskarb@students.harker.org",
      "25pranavs@students.harker.org",
      "25rahuly@students.harker.org",
      "25rajasa@students.harker.org",
      "25rayana@students.harker.org",
      "25reib@students.harker.org",
      "25rishil@students.harker.org",
      "25rithikay@students.harker.org",
      "25robertf@students.harker.org",
      "25rohanr@students.harker.org",
      "25rohity@students.harker.org",
      "25ruhans@students.harker.org",
      "25rumig@students.harker.org",
      "25rushilj@students.harker.org",
      "25saahirad@students.harker.org",
      "25sahilv@students.harker.org",
      "25sahngwiey@students.harker.org",
      "25samhitap@students.harker.org",
      "25sanaab@students.harker.org",
      "25sarag@students.harker.org",
      "25savyaa@students.harker.org",
      "25shailat@students.harker.org",
      "25shivd@students.harker.org",
      "25shivenb@students.harker.org",
      "25shivrajp@students.harker.org",
      "25shreyasc@students.harker.org",
      "25shrutis@students.harker.org",
      "25sidaks@students.harker.org",
      "25sofiem@students.harker.org",
      "25sohuma@students.harker.org",
      "25sophial@students.harker.org",
      "25sophiar@students.harker.org",
      "25sophiaz@students.harker.org",
      "25sophied@students.harker.org",
      "25sritejak@students.harker.org",
      "25stephanieb@students.harker.org",
      "25stevenj@students.harker.org",
      "25summera@students.harker.org",
      "25teja@students.harker.org",
      "25tianas@students.harker.org",
      "25tiffanyg@students.harker.org",
      "25valeriel@students.harker.org",
      "25varunb@students.harker.org",
      "25varunt@students.harker.org",
      "25vedantb@students.harker.org",
      "25vedanty@students.harker.org",
      "25veers@students.harker.org",
      "25victorg@students.harker.org",
      "25vikag@students.harker.org",
      "25vyomv@students.harker.org",
      "25yasmins@students.harker.org",
      "25yifanl@students.harker.org",
      "25youngm@students.harker.org",
      "25zacharys@students.harker.org",
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

