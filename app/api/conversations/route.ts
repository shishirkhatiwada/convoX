import { db } from "@/db/client";
import { chatBotMetadata, conversation, message } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET() {


    try {
        const user = await isAuthorized()

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const bots = await db.select().from(chatBotMetadata).where(eq(chatBotMetadata.user_email, user.email))

        if (bots.length === 0) {
            return NextResponse.json({ conversations: [] })
        }


        const botIds = bots.map((bot) => bot.id);

        const convs = await db.select().from(conversation).where(inArray(conversation.chatbot_id, botIds)).orderBy(desc(conversation.created_at))

        const data = await Promise.all(
            convs.map(async (c) => {
                const [lastMessage] = await db.select().from(message).where(eq(message.conversation_id, c.id)).orderBy(desc(message.created_at)).limit(1)

                let timeDisplay = ""

                const ts = lastMessage?.created_at || c.created_at

                if (ts) {
                    const now = new Date()
                    const date = new Date(ts)
                    const diffMs = now.getTime() - date.getTime()
                    const diffMins = Math.floor(diffMs / 60000)
                    const diffHours = Math.floor(diffMins / 60)
                    const diffDays = Math.floor(diffHours / 24)

                    if (diffMins < 1) {
                        timeDisplay = "Just now"
                    } else if (diffMins < 60) {
                        timeDisplay = `${diffMins}m ago`
                    } else if (diffHours < 24) {
                        timeDisplay = `${diffHours}h ago`
                    } else if (diffDays < 7) {
                        timeDisplay = `${diffDays}d ago`
                    } else {
                        timeDisplay = date.toLocaleDateString()
                    }
                }

                return {
                    id: c.id,
                    user: c.name,
                    lastMessage: lastMessage?.content || "Started Conversation",
                    status: "active",
                    time: timeDisplay,
                    visitor_ip: c.visitor_ip
                }
            })
        )

        return NextResponse.json({ conversations: data });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

}