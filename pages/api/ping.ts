import {
  createVectorStore,
  getMarkdownStore,
  loadMarkdownChunks,
} from '@/utils/markdownVectorStore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const store = await getMarkdownStore();

    const data = store;
    // const data = await createVectorStore(textChunks);

    res.status(200).json({ data });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error });
  }
}
