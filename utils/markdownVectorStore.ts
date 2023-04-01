import { Document } from 'langchain/document';
import { TextLoader } from 'langchain/document_loaders';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HNSWLib } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { text } from 'stream/consumers';

// Reference docs
// Vector store - https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/hnswlib
// Text splitting - https://js.langchain.com/docs/modules/indexes/text_splitters/examples/recursive_character

const SOURCE_FILE = 'docs/hund/key-principles.txt';
const VECTORSTORE_SAVE_LOCATION = 'vectorstore';

// Load index from disk
async function getVectorStoreFromDisk(): Promise<HNSWLib | null> {
  try {
    const loadedVectorStore = await HNSWLib.load(
      VECTORSTORE_SAVE_LOCATION,
      new OpenAIEmbeddings(),
    );
    console.log('[getVectorStoreFromDisk] success');
    return loadedVectorStore;
  } catch (e) {
    console.error('[getVectorStoreFromDisk] failed -', e);
    return null;
  }
}

// Create index from documents (and attempt to save to disk)
async function createVectorStore(
  documents: Document[],
): Promise<HNSWLib | null> {
  try {
    const vectorStore: HNSWLib = await HNSWLib.fromDocuments(
      documents,
      new OpenAIEmbeddings(),
    );
    console.log('[createVectorStore] success');
    return vectorStore;
  } catch (e) {
    console.error('[createVectorStore] failed -', e);
    return null;
  }
}

// Attempt to save to disk
async function saveVectorStore(vectorStore: HNSWLib): Promise<HNSWLib | null> {
  try {
    await vectorStore.save(VECTORSTORE_SAVE_LOCATION);
    console.log('[saveVectorStore] success');
    return vectorStore;
  } catch (e) {
    console.error('[saveVectorStore] failed -', e);
    return null;
  }
}

// Load a TXT file from disk + split it into chunks
export const loadMarkdownChunks = async (): Promise<Document[] | null> => {
  try {
    // Load the source file
    const loader = new TextLoader(SOURCE_FILE);
    const rawText: Document[] = await loader.load();

    // Split the source Document[] into chunks (a list of Document[])
    const splitter = new RecursiveCharacterTextSplitter();
    const textChunks = await splitter.splitDocuments(rawText);

    return textChunks;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getMarkdownStore = async (): Promise<HNSWLib | null> => {
  try {
    // Try to load from disk
    const vectorStoreFromDisk = await getVectorStoreFromDisk();
    if (vectorStoreFromDisk) {
      return vectorStoreFromDisk;
    }

    // Get markdown chunks
    const textChunks = await loadMarkdownChunks();
    if (textChunks === null) {
      throw new Error('Received bad text chunks from loadMarkdownChunks()');
    }

    // Generate index from chunks
    const newVectorStore = await createVectorStore(textChunks);

    // Attempt to save to disk
    if (newVectorStore !== null) {
      saveVectorStore(newVectorStore);
    }

    return newVectorStore;
  } catch (e) {
    console.error(e);
    return null;
  }
};
