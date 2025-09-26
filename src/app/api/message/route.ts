import { db } from "@/db";
import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

// asking a question to a pdf file
export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const { getUser } = getKindeServerSession();
    const user = getUser();

    const { id: userId } = user;

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { fileId, message } = SendMessageValidator.parse(body);

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId,
        },
    });

    if (!file) return new Response("Not found", { status: 404 });

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId,
            fileId,
        },
    });

    // create a vector of a message

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
        dimensions: 1024,
    });

    const pinecone = getPineconeClient();
    const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace: file.id,
    });

    const results = await vectorStore.maxMarginalRelevanceSearch(message, {
        k: 4,
    });

    const prevMessages = await db.message.findMany({
        where: {
            fileId,
        },
        orderBy: {
            createdAt: "asc",
        },
        take: 6,
    });

    const formattedPrevMessages = prevMessages.map((message) => ({
        role: message.isUserMessage
            ? ("user" as const)
            : ("assistant" as const),
        content: message.text,
    }));

    const result = streamText({
        model: createOpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
        })("gpt-3.5-turbo"),
        temperature: 0,
        messages: [
            {
                role: "system",
                content:
                    "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
            },
            {
                role: "user",
                content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
      if (message.role === "user") return `User: ${message.content}\n`;
      return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r: any) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
            },
        ],
        onFinish: async (completion) => {
            await db.message.create({
                data: {
                    text: completion.text,
                    isUserMessage: false,
                    fileId,
                    userId,
                },
            });
        },
    });

    return result.toTextStreamResponse();
};
