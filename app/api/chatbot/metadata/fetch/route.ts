import { db } from "@/db/client";
import { chatBotMetadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET() {
   try {
     const user = await isAuthorized()
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [existingMetadata] = await db.select().from(chatBotMetadata).where(eq(chatBotMetadata.user_email, user.email))

    if(!existingMetadata){
       const [newMetadata] = await db.insert(chatBotMetadata).values({
        user_email: user.email,
       
       }).returning()
       return NextResponse.json(newMetadata)
    }
    
    return NextResponse.json(existingMetadata)
   } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    
   }


}