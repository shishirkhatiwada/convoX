"use client"

import { isAuthorized } from "@/lib/isAuth"
import { useEffect, useState } from "react"

// Fix: Remove async from hook declaration - hooks cannot be async
export const useUser = () => {
    const [email, setEmail] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchUser = async () => {
            const user = await isAuthorized()
            setEmail(user?.email)
            setLoading(false)
        }
        fetchUser()
    }, [])
    return { email, loading }
}