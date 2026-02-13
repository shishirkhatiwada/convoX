import { db } from "@/db/client";
import { chatBotMetadata, conversation, message } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await isAuthorized()

        if(!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const {id:conversationId} =  await params

        const [conv] = await db.select().from(conversation).where(eq(conversation.id, conversationId))

        if(!conv) {
            return NextResponse.json({ message: "Conversation not found" }, { status: 404 });
        }

        const [bot] = await db.select().from(chatBotMetadata).where(and(eq(chatBotMetadata.id, conv.chatbot_id),eq(chatBotMetadata.user_email, user.email))).limit(1)


        if(!bot) {
            return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
        }

        const msgs = await db.select().from(message).where(eq(message.conversation_id, conversationId)).orderBy(asc(message.created_at))

        return NextResponse.json({ messages: msgs })

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        
    }
}