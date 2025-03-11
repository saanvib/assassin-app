import { getAll } from '@vercel/edge-config';
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Student } from '../src/components/utils/studentType';


export default async function GET(req: VercelRequest, res: VercelResponse) {
   const configItems = await getAll();
   const studentList: any[] = [];
   let studentAliveCount = 0;
   for (const item in configItems) {
      const student = configItems[item] as unknown as Student;
      if (student.status != "eliminated") {
         const {username, killCount} = student;
         studentList.push({"username": username, "killCount": killCount});
         studentAliveCount += 1;
      }
   }

   studentList.sort((a, b) => {
      if (a.killCount < b.killCount) {
         return 1;
      }
      if (a.killCount > b.killCount) {
         return -1;
      }
      return 0;
   });

   return res.json({
      leaderboard: studentList.slice(0, 30),
      totalAlive: studentAliveCount,
   })
}