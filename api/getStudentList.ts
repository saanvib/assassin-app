import { getAll } from '@vercel/edge-config';
import type { VercelRequest, VercelResponse } from '@vercel/node'

interface Student {
   "username": string,
   "killCount": number,
   "absences": string[],
   "assassin": string,
   "status": string,
   "target": string,
   "targetStatus": string
}

// returns top 10 users with their kill count
// {[{name:username, count:count}]}
export default async function handler(req: VercelRequest, res: VercelResponse) {
   const configItems = await getAll();
   const studentList: Student[] = [];
   for (const item in configItems) {
      const student = configItems[item] as unknown as Student;
      studentList.push(student);
   }

   console.log(studentList);
   return res.json({
      studentList: studentList,
   })
}