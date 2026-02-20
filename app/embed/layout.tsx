import React from 'react'
export const dynamic = 'force-dynamic'

const EmbedPageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            className="h-screen w-screen overflow-hidden flex flex-col p-0 antialiased text-zinc-100 selection:bg-zinc-800"
        >
{children}
        </div>
    )
}

export default EmbedPageLayout