import { db } from "@/db/client";
import { chatBotMetadata, conversation, message } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }

) {
    try {
        const user = await isAuthorized();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id: conversationId } = await params;

        const { content } = await request.json();

        if (!content || !content.trim()) {
            return NextResponse.json({ message: "Missing content" }, { status: 400 });
        }


        const [conv] = await db.select().from(conversation).where(eq(conversation.id, conversationId));

        if (!conv) {
            return NextResponse.json({ message: "Conversation not found" }, { status: 404 });
        }

        const [bot] = await db.select().from(chatBotMetadata).where(and(eq(chatBotMetadata.id, conv.chatbot_id), eq(chatBotMetadata.user_email, user.email)));


        if (!bot) {
            return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
        }
        await db.insert(message).values({ content, role: "assistant", conversation_id: conversationId });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

}