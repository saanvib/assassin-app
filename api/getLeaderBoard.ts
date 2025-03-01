import { getAll } from '@vercel/edge-config';
import type { VercelRequest, VercelResponse } from '@vercel/node'
import {Student} from '../src/components/utils/studentType.tsx';


export default async function handler(req: VercelRequest, res: VercelResponse) {
   const configItems = await getAll();
   const studentList: Student[] = [];
   for (const item in configItems) {
      const student = configItems[item] as unknown as Student;
      studentList.push(student);
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

   console.log(studentList);
   return res.json({
      leaderboard: studentList.slice(0, 10),
   })
}