import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  let { name = 'Wordle' } = req.query
  console.log(req.query);
  if (name=="saanvi")
   { 
      name="Vi"
   }
  return res.json({
    message: `Hello ${name}!`,
  })
}