import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { countConversationToken } from "@/lib/countConversationToken";
import { isAuthorized } from "@/lib/isAuth";
import { gemini, summarizeConversation } from "@/lib/openAi";
import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    const user = await isAuthorized()
    if(!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let messages = body.messages;
    let knowledge_source_id = body.knowledge_source_id;
    
    if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ error: "Messages must be an array", received: messages }, { status: 400 });
    }

    let context = ""

    if(knowledge_source_id && knowledge_source_id.length > 0){
        const sources = await db.select({
                content: knowledge_source.content
            }).from(knowledge_source).where(inArray(knowledge_source.id, knowledge_source_id))
            context = sources.map((source) => source.content).filter(Boolean).join("\n")
    }

    const tokenCount = countConversationToken(messages)


    if(tokenCount > 6000){
        const recentMessages = messages.slice(-10)

        const olderMessages = messages.slice(0, -10)

        if(olderMessages.length > 0){
            const summary = await summarizeConversation(olderMessages)

            context = `PREVIOUS CONVERSATION SUMMARY: ${summary}\n\n${context}\n\n`

            messages = recentMessages
        }
    }

    const systemPrompt = `
    You are a helpful assistant. your name is ConvoX AI. You will be provided with a conversation history and context. You will answer the user's question based on the conversation history and context.
   CRITICAL RULES:
   - You will be provided with a conversation history and context. You will answer the user's question based on the conversation history and context.
   - You will not answer anything that is not related to the conversation history and context.
   - You will not answer anything that is not related to the user's question.
   - KEEP ANSWERS EXTREMELY SHORT (MAX 1-2 SENTENCES)
   ESCALATION RULE:
   -If you simply DON'T KNOW the answer, you MUST ask the user if they would like to create a support ticket. 
- If the user expresses unresolved issues, repeated problems, dissatisfaction, or asks for human help/support, you must ask if they would like to create a support ticket.
- When escalating, your entire response MUST be:[ escalated] I have created a support ticket and will be in touch shortly.
- Do not add any other text, punctuation, or explanation.
   CONTEXT: ${context}
    `

   try {
    // FIXED: Gemini doesn't use createChatCompletion, it uses getGenerativeModel and generateContent
    const model = gemini.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    // FIXED: Filter out welcome messages and ensure history starts with user message
    const validMessages = messages.filter((msg: any) => !msg.isWelcome);
    
    // Format messages for Gemini (it expects a different format than OpenAI)
    const chatHistory = validMessages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    // FIXED: Ensure history starts with user message (Gemini requirement)
    const historyForGemini = chatHistory.slice(0, -1); // All except last message
    const lastMessage = validMessages[validMessages.length - 1];
    
    // If history is empty or starts with model, we'll use a simple generate instead of chat
    if (historyForGemini.length === 0 || historyForGemini[0].role === 'model') {
        const prompt = `${systemPrompt}\n\nUser: ${lastMessage.content}`;
        const result = await model.generateContent(prompt);
        const reply = result.response.text() || "I am sorry, I could not answer your question. Please try again.";
        return NextResponse.json({ reply });
    }

    // Start chat with history
    const chat = model.startChat({
        history: historyForGemini,
        generationConfig: {
            maxOutputTokens: 200, // Keep responses short
            temperature: 0.7,
        },
    });

    // Send the last message with system prompt as context
    const prompt = `${systemPrompt}\n\nUser: ${lastMessage.content}`;
    
    const result = await chat.sendMessage(prompt);
    const reply = result.response.text() || "I am sorry, I could not answer your question. Please try again.";

    return NextResponse.json({ reply })
   } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
   }
}