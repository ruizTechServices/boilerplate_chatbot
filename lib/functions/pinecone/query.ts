import pinecone from "@/lib/clients/pinecone/client";
import { getTextEmbedding } from "@/lib/functions/openai/embeddings";
import dotenv from 'dotenv'
dotenv.config()

export async function semanticSearch(query: string, topK = 5) {
    const namespace = process.env.PINECONE_NAMESPACE;
    if (!namespace) {
      throw new Error("PINECONE_NAMESPACE is not set in environment variables.");
    }
    const embedding = await getTextEmbedding(query);
    const res = await pinecone
      .namespace(namespace)
      .query({ topK, vector: embedding, includeMetadata: true });
    return res.matches; // [{ id, score, metadata }]
}