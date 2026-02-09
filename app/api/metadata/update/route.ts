import { db } from "@/db/client";
import { chatBotMetadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function PUT(res: Response) {
    try {
        const user = await isAuthorized()

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await res.json()

        const { color, welcome_message } = body

        if (!color || !welcome_message) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }
    
        const [updatedMetadata ] = await db.update(chatBotMetadata)
        .set({ color, welcome_message })
        .where(eq(chatBotMetadata.user_email, user.email))
        .returning()

        return NextResponse.json(updatedMetadata, { status: 200 });
        
    } catch {

     }
} 