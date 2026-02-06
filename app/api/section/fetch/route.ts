import { db } from "@/db/client";
import { section } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await db.select().from(section).where(eq(section.user_email, user.email));

        return NextResponse.json({ sections: response }, { status: 200 });

    } catch (error) {
        console.error("Error fetching sections:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
