import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {

    const user = await isAuthorized()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rawSources = await db.select().from(knowledge_source).where(eq(knowledge_source.user_email, user.email))
    
    const sources = rawSources.map(source => ({
        ...source,
        last_updated: source.last_updated_at
    }));

    return NextResponse.json({ sources }, { status: 200 });
}