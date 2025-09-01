import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) {
  throw new Error("Missing PINECONE_API_KEY env var");
}

const pc = new Pinecone({ apiKey });

if (!process.env.PINECONE_INDEX) {
  throw new Error("Missing PINECONE_INDEX env var");
}
const index = pc.index(process.env.PINECONE_INDEX);

export default index;
export { pc };
