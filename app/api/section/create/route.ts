import { db } from "@/db/client";
import { section } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const nuser = await isAuthorized();
        if (!nuser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const { name, description, tone, allowedTopics, blockedTopics, sourceIds } = body;

        if (!name || !description || !tone) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (!sourceIds || !Array.isArray(sourceIds) || sourceIds.length === 0) {
            return NextResponse.json({ message: "At least one source is required" }, { status: 400 });
        }

        const newSection = await db.insert(section).values({
            name,
            description,
            tone,
            allowed_topics: allowedTopics,
            blocked_topics: blockedTopics,
            source_ids: JSON.stringify(sourceIds),
            user_email: nuser.email,
            status: "active"
        }).returning();

        return NextResponse.json({ message: "Section created successfully", section: newSection }, { status: 201 });

    } catch (error) {
        console.error("Error creating section:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}