import { getMarkdownStore } from '@/utils/markdownVectorStore';

const DEFAULT_QUERY =
  'Which words should we avoid using when training our dog?';

export async function queryMarkdownIndex(query = DEFAULT_QUERY) {
  try {
    // Load the vector store
    const vectorStore = await getMarkdownStore();
    if (vectorStore === null) {
      console.error('Cannot query a non-existent vectorStore');
      return false;
    }

    const result = await vectorStore.similaritySearch(query, 1);
    console.log(result);
    return result;
  } catch (e) {
    console.error(e);
    return false;
  }
}
