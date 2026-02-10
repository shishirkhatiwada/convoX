import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import scalekit from "@/lib/scalekit";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
try {
    const LoggedInUser  = await isAuthorized()

    if(!LoggedInUser) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json()
    console.log("Received body:", body); // Debug log
    const {email, name} = body

    if(!email || !name) {
        console.log("Missing fields - email:", email, "name:", name); // Debug log
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const pendingTeamMember = await db.select().from(teamMembers).where(eq(teamMembers.user_email, email))

    if(pendingTeamMember.length > 0) {
        return NextResponse.json({ message: "Team member already Invited" }, { status: 400 });
    }

    const {user} = await scalekit.user.createUserAndMembership(LoggedInUser.organization_id,{ email,
        userProfile:{
            firstName: name || email.split('@')[0],
            lastName:""
        },
        sendInvitationEmail: true
    })

     await db.insert(teamMembers).values({
        organization_id: LoggedInUser.organization_id,
        user_email: email,
        name: name || email.split('@')[0],
    })

    return NextResponse.json({ message: "Team member Invited", user }, { status: 200 });

    }

   
catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
}
}
