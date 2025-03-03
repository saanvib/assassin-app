import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, get, getAll } from '@vercel/edge-config';
import DescopeClient from '@descope/node-sdk';
import {Student} from '../src/components/utils/studentType';

export default async function GET(req: VercelRequest, res: VercelResponse) {
   const { headers } = req;
   const users = ["25SummerA@students.harker.org",
      "25MayaA@students.harker.org",
      "25SavyaA@students.harker.org",
      "25ClaireA@students.harker.org",
      "25KylieA@students.harker.org",
      "25HadenA@students.harker.org",
      "25RajasA@students.harker.org",
      "25SohumA@students.harker.org",
      "25RayanA@students.harker.org",
      "25TejA@students.harker.org",
      "25VedantB@students.harker.org",
      "25ShivenB@students.harker.org",
      "25AaronB@students.harker.org",
      "25OskarB@students.harker.org",
      "25AryanaB@students.harker.org",
      "25SaanviB@students.harker.org",
      "25SanaaB@students.harker.org",
      "25VarunB@students.harker.org",
      "25ReiB@students.harker.org",
      "25FernB@students.harker.org",
      "25MarcusB@students.harker.org",
      "25AaravB@students.harker.org",
      "25StephanieB@students.harker.org",
      "25AngelinaB@students.harker.org",
      "25IrisC@students.harker.org",
      "25CaioC@students.harker.org",
      "25ShreyasC@students.harker.org",
      "25GemmaC@students.harker.org",
      "25AaronC@students.harker.org",
      "25AinslieC@students.harker.org",
      "25BellaC@students.harker.org",
      "25DanielC@students.harker.org",
      "25FelixC@students.harker.org",
      "25GeorgeC@students.harker.org",
      "25HarrisonC@students.harker.org",
      "25NolanC@students.harker.org",
      "25AudreyC@students.harker.org",
      "25ClaireC@students.harker.org",
      "25AndyC@students.harker.org",
      "25KyraC@students.harker.org",
      "25AnanyaD@students.harker.org",
      "25NaiyaD@students.harker.org",
      "25SaahiraD@students.harker.org",
      "25SophieD@students.harker.org",
      "25ShivD@students.harker.org",
      "25DanielD@students.harker.org",
      "25KerenE@students.harker.org",
      "25GiaE@students.harker.org",
      "25YasminE@students.harker.org",
      "25AudreyF@students.harker.org",
      "25MirabelleF@students.harker.org",
      "25RobertF@students.harker.org",
      "25CharlieF@students.harker.org",
      "25BennyF@students.harker.org",
      "25ArianaG@students.harker.org",
      "25VikaG@students.harker.org",
      "25DanielG@students.harker.org",
      "25IanG@students.harker.org",
      "25AvaynaG@students.harker.org",
      "25SaraG@students.harker.org",
      "25AtharvG@students.harker.org",
      "25KalebG@students.harker.org",
      "25VictorG@students.harker.org",
      "25NelsonG@students.harker.org",
      "25AkulG@students.harker.org",
      "25TiffanyG@students.harker.org",
      "25KaiyueG@students.harker.org",
      "25AaronG@students.harker.org",
      "25OliviaG@students.harker.org",
      "25RumiG@students.harker.org",
      "25ChilingH@students.harker.org",
      "25AnwenH@students.harker.org",
      "25BrendonH@students.harker.org",
      "25SaahilH@students.harker.org",
      "25KaiH@students.harker.org",
      "25JacquelineH@students.harker.org",
      "25AlexH@students.harker.org",
      "25RushilJ@students.harker.org",
      "25LiamJ@students.harker.org",
      "25JiajiaJ@students.harker.org",
      "25StevenJ@students.harker.org",
      "25GaryJ@students.harker.org",
      "25AveryJ@students.harker.org",
      "25SritejaK@students.harker.org",
      "25KeshavK@students.harker.org",
      "25NeilK@students.harker.org",
      "25RishiL@students.harker.org",
      "25HannahL@students.harker.org",
      "25EricL@students.harker.org",
      "25GabeL@students.harker.org",
      "25JasonL@students.harker.org",
      "25JulianaL@students.harker.org",
      "25KyleL@students.harker.org",
      "25ValerieL@students.harker.org",
      "25YifanL@students.harker.org",
      "25EvaL@students.harker.org",
      "25AndrewL@students.harker.org",
      "25AbbyL@students.harker.org",
      "25LaurenL@students.harker.org",
      "25AustinL@students.harker.org",
      "25NatalieL@students.harker.org",
      "25SophiaL@students.harker.org",
      "25IsabellaL@students.harker.org",
      "25AndreL@students.harker.org",
      "25GenieveM@students.harker.org",
      "25sofiem@students.harker.org",
      "25KaterinaM@students.harker.org",
      "25StefanM@students.harker.org",
      "25NorahM@students.harker.org",
      "25ChayceM@students.harker.org",
      "25HarrissM@students.harker.org",
      "25EmmaM@students.harker.org",
      "25YoungM@students.harker.org",
      "25EmilyM@students.harker.org",
      "25AdvayM@students.harker.org",
      "25HasiniN@students.harker.org",
      "25AnikaP@students.harker.org",
      "25ShivrajP@students.harker.org",
      "25SamhitaP@students.harker.org",
      "25AdamP@students.harker.org",
      "25JeremyP@students.harker.org",
      "25ClaireP@students.harker.org",
      "25NikhilP@students.harker.org",
      "25KashishP@students.harker.org",
      "25RohanR@students.harker.org",
      "25AliciaR@students.harker.org",
      "25AgastyaR@students.harker.org",
      "25OliR@students.harker.org",
      "25SophiaR@students.harker.org",
      "25GabeS@students.harker.org",
      "25RuhanS@students.harker.org",
      "25VeerS@students.harker.org",
      "25TianaS@students.harker.org",
      "25AbigailS@students.harker.org",
      "25NavyaS@students.harker.org",
      "25SidakS@students.harker.org",
      "25ArjenS@students.harker.org",
      "25HenryS@students.harker.org",
      "25JasonS@students.harker.org",
      "25AishaniS@students.harker.org",
      "25JacobS@students.harker.org",
      "25LeoS@students.harker.org",
      "25BaharS@students.harker.org",
      "25ZacharyS@students.harker.org",
      "25BhavyaS@students.harker.org",
      "25ShrutiS@students.harker.org",
      "25HannahS@students.harker.org",
      "25EmilyS@students.harker.org",
      "25KaitlynS@students.harker.org",
      "25YasminS@students.harker.org",
      "25PranavS@students.harker.org",
      "25ShailaT@students.harker.org",
      "25CalebT@students.harker.org",
      "25HimaT@students.harker.org",
      "25VarunT@students.harker.org",
      "25KhanhlinhT@students.harker.org",
      "25LindseyT@students.harker.org",
      "25AarushV@students.harker.org",
      "25SahilV@students.harker.org",
      "25DeeyaV@students.harker.org",
      "25VyomV@students.harker.org",
      "25LiannaW@students.harker.org",
      "25AidanW@students.harker.org",
      "25CharlizeW@students.harker.org",
      "25EthanW@students.harker.org",
      "25JessicaW@students.harker.org",
      "25JessicaWa@students.harker.org",
      "25JonathanW@students.harker.org",
      "25ElenaW@students.harker.org",
      "25CaitlynW@students.harker.org",
      "25ArthurW@students.harker.org",
      "25BowenX@students.harker.org",
      "25JonnyX@students.harker.org",
      "25VedantY@students.harker.org",
      "25RahulY@students.harker.org",
      "25RohitY@students.harker.org",
      "25RithikaY@students.harker.org",
      "25AlisonY@students.harker.org",
      "25AllisonY@students.harker.org",
      "25GrantY@students.harker.org",
      "25JasonY@students.harker.org",
      "25SahngwieY@students.harker.org",
      "25MelodyY@students.harker.org",
      "25CindyY@students.harker.org",
      "25SoniaY@students.harker.org",
      "25LukeZ@students.harker.org",
      "25MaxZ@students.harker.org",
      "25AlecZ@students.harker.org",
      "25EricZ@students.harker.org",
      "25JeffreyZ@students.harker.org",
      "25ClaireZ@students.harker.org",
      "25AlexZ@students.harker.org",
      "25YinanZ@students.harker.org",
      "25SophiaZ@students.harker.org",
      "25MaziarZ@students.harker.org",
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
                  "absences": [],
                  "assassin": "",
                  "status": "alive",
                  "target": "",
                  "targetStatus": "alive"
               })
            }

            for (const student in studentList) {
               items.push({ key: studentList[student].username, operation: "create", value: studentList[student] });
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
      }
   } catch (error) {
      console.log("failed to initialize: " + error)
   }





   return res.json({

   })
}