import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

const API_KEY = "AIzaSyAjzvV1Na0EuRpNeX8KxA6WZdOKNPn4OrA";

class GoogleEmbeddingsWrapper {
  constructor(apiKey) {
    this.embedding = new GoogleGenerativeAIEmbeddings({
      apiKey,
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
    });
  }

  async embedDocuments(texts) {
    return Promise.all(texts.map((text) => this.embedding.embedQuery(text)));
  }

  async embedQuery(text) {
    return this.embedding.embedQuery(text);
  }
}

export const ingest = action({
  args: {
    splitText: v.array(v.string()),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const embeddings = new GoogleEmbeddingsWrapper(API_KEY);
    const metadata = args.splitText.map(() => ({ fileId: args.fileId }));
    await ConvexVectorStore.fromTexts(args.splitText, metadata, embeddings, { ctx });
    console.log("📄 Ingesting Chunks (first 2):", args.splitText.slice(0, 2));
    return "✅ Ingest complete";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const embeddings = new GoogleEmbeddingsWrapper(API_KEY);
    const vectorStore = new ConvexVectorStore(embeddings, { ctx });
    const results = await vectorStore.similaritySearch(args.query, 3);
    let filtered = results.filter((r) => r.metadata?.fileId === args.fileId);

    if (!filtered.length && results.length > 0) {
      console.warn("⚠️ No matching fileId in results. Using fallback top results.");
      filtered = results;
    }

    if (!filtered.length) {
      return { answer: "❌ No matching content found." };
    }

    const limitedChunks = filtered.slice(0, 3);
    const combinedAnswer = limitedChunks.map((r) => r.pageContent).join("\n\n");
    console.log("🟩 Search Results Sent to Gemini:\n", combinedAnswer);

    return { answer: combinedAnswer };
  },
});
