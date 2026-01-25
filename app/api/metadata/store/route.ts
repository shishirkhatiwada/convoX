import { db } from "@/db/client";
import { metadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await isAuthorized();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { business_name, website_url, external_link } = await req.json();

  // Fix: Make external_link optional since it's marked as optional in the form
  if (!business_name || !website_url) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  // Fix: Add .returning() to complete the insert query
  const metadataResponse = await db
    .insert(metadata)
    .values({
      user_email: user.email,
      business_name,
      website_url,
      external_link,
    })
    .returning();
    
 (await cookies()).set("metadata", JSON.stringify(business_name));

  return NextResponse.json(metadataResponse, { status: 201 });
}
