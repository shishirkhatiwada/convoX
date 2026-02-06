import { db } from "@/db/client";
import { section } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "Missing sectionID" }, { status: 400 });
        }


        const sections = await db.select().from(section).where(eq(section.id, id));

        if (sections.length === 0) {
            return NextResponse.json({ message: "Section not found" }, { status: 404 });
        }

      const response = await db.delete(section).where(eq(section.id, id)).returning();

    } catch (error) {
        console.error("Error fetching sections:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
