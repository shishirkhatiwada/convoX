import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/db/client";
import { conversation, knowledge_source } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { message as messageTable } from "@/db/schema";
import { countConversationToken } from "@/lib/countConversationToken";
import { gemini, summarizeConversation } from "@/lib/openAi";


export async function POST(req: Request) {

    const authHeader = req.headers.get('authorization')

    const token = authHeader?.split(' ')[1]

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let sessionId: string | undefined
    let widgetId: string | undefined

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);
        sessionId = payload.sessionId as string
        widgetId = payload.widgetId as string

        if (!sessionId || !widgetId) {
            return NextResponse.json({ message: "Invalid Payload Token" }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Token verification failed" }, { status: 401 });
    }


    let { message, source_ids, knowledge_source_id } = await req.json();

    if (!message || !Array.isArray(message) || message.length === 0) {
        return NextResponse.json({ message: "Invalid message format" }, { status: 400 });
    }

    const lastMessage = message[message.length - 1];


    if (!lastMessage || lastMessage.role !== "user") {
        console.log("No new user message detected or invalid format");
    }

    try {
        const [existingConvo] = await db.select().from(conversation).where(eq(conversation.id, sessionId)).limit(1)

        if (!existingConvo) {
            const forwardedFor = req.headers.get('x-forwarded-for');
            const ip = forwardedFor ? forwardedFor.split(',')[0] : "unknown ip";

            const visitorName = `#Visitor: ${ip}`

            await db.insert(conversation).values({
                id: sessionId,
                chatbot_id: widgetId,
                visitor_ip: ip,
                name: visitorName,

            }).returning()

            const previousMessages = message.slice(0, -1)
            if (previousMessages.length > 0) {
                for (const msg of previousMessages) {
                    await db.insert(messageTable).values({
                        conversation_id: sessionId,
                        role: msg.role as "user" | "assistant",
                        content: msg.content
                    }).returning()
                }
            }
        }

        if (lastMessage && lastMessage.role === "user") {
            await db.insert(messageTable).values({
                conversation_id: sessionId,
                role: "user",
                content: lastMessage.content
            }).returning()
        }

    } catch (error) {
        console.error("something went wrong while storing in DB", error)
    }



    let context = ""
    let knowledge_source_ids = knowledge_source_id || source_ids;

    // Ensure it's an array
    if (knowledge_source_ids && !Array.isArray(knowledge_source_ids)) {
        knowledge_source_ids = [knowledge_source_ids];
    }

    if (knowledge_source_ids && Array.isArray(knowledge_source_ids) && knowledge_source_ids.length > 0) {
        try {
            const sources = await db.select({
                content: knowledge_source.content
            }).from(knowledge_source).where(inArray(knowledge_source.id, knowledge_source_ids))
            context = sources.map((source) => source.content).filter(Boolean).join("\n\n")
        } catch (error) {
            console.error("RAG retrive failed", error)
        }
    }


     const tokenCount = countConversationToken(message)
    
    
        if(tokenCount > 6000){
            const recentMessages = message.slice(-10)
    
            const olderMessages = message.slice(0, -10)
    
            if(olderMessages.length > 0){
                const summary = await summarizeConversation(olderMessages)
    
                context = `PREVIOUS CONVERSATION SUMMARY: ${summary}\n\n${context}\n\n`
    
                message = recentMessages
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
        const validMessages = message.filter((msg: any) => !msg.isWelcome);
        
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
    

        try {
            await db.insert(messageTable).values({
                conversation_id: sessionId,
                role: "assistant",
                content: reply
            })
        } catch (error) {
            console.error("Database message failed", error)
        }

        return NextResponse.json({ reply })
       } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
       }

}