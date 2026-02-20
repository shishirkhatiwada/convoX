import { db } from "@/db/client";
import { chatBotMetadata, conversation, knowledge_source, message, section } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";

import { count, desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bots = await db.select().from(chatBotMetadata).where(eq(chatBotMetadata.user_email, user.email));

        const botIds = bots.map((bot) => bot.id);

        const ks = await db.select({
            type: knowledge_source.type,
            count: count()
        }).from(knowledge_source).where(eq(knowledge_source.user_email, user.email)).groupBy(knowledge_source.type);

        const knowledgeStats = {
            website: 0,
            uploads: 0,
            text: 0,
            total: 0
        }

        ks.forEach((k) => {
            if (k.type === "website") {
                knowledgeStats.website += k.count;
            }
            if (k.type === "upload") {
                knowledgeStats.uploads += k.count;
            }
            if (k.type === "text") {
                knowledgeStats.text += k.count;
            }
            knowledgeStats.total += k.count;
        })

        const recentSections = await db.select().from(section).where(eq(section.user_email, user.email))


        const sectionStats = {
            total: recentSections.length,
            list: recentSections.map((s) => ({
                name: s.name,
                sourceCount: s.source_ids.length,
                tone: s.tone,
             
            }))
        }

        const [totalSections] = await db.select({
            value: count()
        }).from(section).where(eq(section.user_email, user.email));

        sectionStats.total = totalSections.value;

        let recentChats : {title:string; snippet:string;time:string}[] = [];

        let totalConversations = 0;

        if(botIds.length > 0){
            const rawConvs = await db.select().from(conversation).where(inArray(conversation.chatbot_id, botIds)).orderBy(desc(conversation.created_at)).limit(5);
       
            totalConversations = rawConvs.length;

            recentChats = await Promise.all(rawConvs.map( async (c) => {
               const [lastMsg] = await db.select().from(message).where(eq(message.conversation_id, c.id)).orderBy(desc(message.created_at)).limit(1);

               let timeDisplay = "";

               const ts = lastMsg?.created_at || c.created_at;
               if(ts){
                const date = new Date(ts);
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffMins = Math.floor(diffMs / 60000);

                if(diffMins < 60) timeDisplay = `${diffMins} mins ago`;
                else if(diffMins < 1440) timeDisplay = `${Math.floor(diffMins/60)} hours ago`;
                else timeDisplay = `${Math.floor(diffMins/1440)} days ago`;
               }

               return{
                title: c.name || "Untitled Chat",
                snippet: lastMsg?.content || "No Conversation yet",
                time: timeDisplay
               }
            }))

            if(totalConversations > 0 && recentChats.length < 5){

            } else if(totalConversations > 5){
                const [t] = await db.select({
                    value: count()
                }).from(conversation).where(inArray(conversation.chatbot_id, botIds));

                totalConversations = t.value;
            } 

        }

        return NextResponse.json({
            botId: botIds[0] || null,
            knowledgeStats: knowledgeStats,
            sectionStats : sectionStats,
            chats:recentChats,
            counts: {
               knowledge: knowledgeStats.total,
               sections: totalSections.value,
                conversations: totalConversations,
            }
        })

    } catch (error) {
        console.error("Error fetching overview data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}