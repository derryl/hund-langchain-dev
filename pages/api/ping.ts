import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = 'success!';

    res.status(200).json({ data });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error });
  }
}
