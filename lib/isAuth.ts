"use server"

import { cookies } from "next/headers"

export const isAuthorized = async () => {
    const cookieStore = await cookies()
    // Fix: Cookie name should match what's set in callback route (user_session)
    const userSession = cookieStore.get("user_session")

    let user = null

    if (userSession) {
        try {
            user = JSON.parse(userSession.value)
        } catch (error) {
            console.log("failed to parse user session cookie:", error);
        }
    }
    return user
}
