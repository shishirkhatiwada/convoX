import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/db/client";
import { chatBotMetadata, section } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)
   const token = searchParams.get('token')

   if(!token) {
        return NextResponse.json({message: "Missing token"}, {status: 400});
   }

   try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const {payload} = await jwtVerify(token, secret);

    const ownerEmail = payload.ownerEmail as string;
    const widgetId = payload.widgetId as string;

    const [meta] = await db.select().from(chatBotMetadata).where(eq(chatBotMetadata.id, widgetId)).limit(1);

    if(!meta) {
        return NextResponse.json({message: "Widget not found"}, {status: 404});
    }

    const userSections = await db.select().from(section).where(eq(section.user_email, ownerEmail));

    return NextResponse.json({metadata: meta, sections: userSections});

   } catch (error) {
    return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    console.log(error);
    
   }

}