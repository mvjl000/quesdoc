import { Pinecone } from "@pinecone-database/pinecone";

// Initialize Pinecone client with the new API
const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

// Export the client instance (no longer async)
export const getPineconeClient = () => {
    return pc;
};

// Export default instance for backward compatibility
export default pc;
