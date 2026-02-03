import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { summarizeMarkdown } from "@/lib/openAi";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const contentType = req.headers.get("content-type") || "";

        let type: string
        let body: any = {}

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            type = formData.get("type") as string

            if (type === "upload") {
                const file = formData.get("file") as File;

                if (!file) {
                    return NextResponse.json({ error: "No file provided" }, { status: 400 });
                }

                const fileContent = await file.text();

                const lines = fileContent.split("\n").filter(line => line.trim() !== "");

                let formattedContent: any = ""

                const markdown = await summarizeMarkdown(fileContent)

                formattedContent = markdown

                await db.insert(knowledge_source).values({
                    user_email: user.email,
                    type: "upload",
                    name: file.name,
                    status: "active",
                    content: formattedContent,
                    meta_data: JSON.stringify({
                        fileName : file.name,
                        fileSize : file.size,
                        fileType : file.type,
                        rowCount : lines.length -1,
                        header: headers

                    })
                })
                return NextResponse.json({ message: "File uploaded and processed successfully" });
            }

        } else {
            body = await req.json()
            type = body.type
        }

        if (type === "website") {
            const apiKey = process.env.ZENROWS_API_KEY;
            const zenUrl = new URL("https://api.zenrows.com/v1/")
            zenUrl.searchParams.set("apikey", apiKey!)
            zenUrl.searchParams.set("url", body.source_url)
            zenUrl.searchParams.set("response_type", "markdown")

            console.log("ZenRows URL:", zenUrl.toString());

            const res = await fetch(zenUrl.toString(), {
                headers: {
                    "User-Agent": "ConvoXBot/1.0"
                }
            })

            const html = await res.text()


            if (!res.text) {
                return NextResponse.json({ error: "ZenRow request failed", status: res.status, body: html.slice(0, 500) }, { status: 500 });
            }

            const markdown = await summarizeMarkdown(html)

            await db.insert(knowledge_source).values({
                user_email: user.email,
                type: "website",
                name: body.source_url,
                status: "active",
                source_url: body.source_url,
                content: markdown,
            })



        } else if (type === "text") {
            let content = body.content

            if(body.content > 500){
                const metadata = await summarizeMarkdown(body.content)
                content = metadata
            }

            await db.insert(knowledge_source).values({
                user_email: user.email,
                type: "text",
                name: body.title,
                status: "active",
                content: content,
            })

            return NextResponse.json({ message: "Source stored successfully" }, { status: 200 });
        }

        return NextResponse.json({ message: "Knowledge source stored successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error in knowledge store:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}