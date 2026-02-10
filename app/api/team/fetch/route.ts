import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(){
try {
    const user = await isAuthorized()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const teamMembersData = await db.select({
        id: teamMembers.id,
        name: teamMembers.name,
        user_email: teamMembers.user_email, // FIXED: Changed from email to user_email to match type
        role: teamMembers.role,
        status: teamMembers.status,
        created_at: teamMembers.created_at
    }).from(teamMembers).where(eq(teamMembers.organization_id, user.organization_id))

    return NextResponse.json(teamMembersData, {
        
    })
    

} catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
}
