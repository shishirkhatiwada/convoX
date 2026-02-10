import { db } from "@/db/client"
import { teamMembers } from "@/db/schema"
import scalekit from "@/lib/scalekit"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
   
    try {
        const body = await req.text()

        const headers = Object.fromEntries(req.headers.entries())

        const secret = process.env.SCALEKIT_WEBHOOK_SECRET!

        try {
            scalekit.verifyWebhookPayload(body, headers, secret)
        } catch (error) {
            console.log("Webhook verification failed:", error);
            return NextResponse.json({ message: "Webhook verification failed" }, { status: 400 });
        }

        const event = JSON.parse(body)
        

        switch(event.type){
            case "user.organization_membership_created":
                const parm = event.data
                await db.update(teamMembers).set({ status: "accepted" }).where(eq(teamMembers.user_email, parm.user.email)).returning()

                break

                default:
                    console.log("Unhandled event type: ", event.type);
                    
        }

        return NextResponse.json({success: true }, { status: 200 });


    } catch (error) {
        console.log("Webhook error" , error);
        
        return NextResponse.json({ message: "Failed to process webhook" }, { status: 500 });
    }

}