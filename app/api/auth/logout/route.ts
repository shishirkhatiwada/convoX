import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        
        // Delete all auth-related cookies
        cookieStore.delete("user_session");
        cookieStore.delete("metadata");
        cookieStore.delete("sk_state");
        
        // Return response with redirect instruction
        return NextResponse.json({ 
            success: true, 
            message: "Logged out successfully",
            redirect: "/"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ success: false, message: "Logout failed" }, { status: 500 });
    }
}

export async function GET() {
    // Support GET method for direct navigation
    const cookieStore = await cookies();
    
    cookieStore.delete("user_session");
    cookieStore.delete("metadata");
    cookieStore.delete("sk_state");
    
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
