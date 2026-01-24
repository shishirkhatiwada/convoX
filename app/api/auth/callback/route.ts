import scalekit from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server"



export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.nextUrl);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    if (error) {
        return new Response(`Error: ${error_description}`, { status: 401 });
    }

    if (!code) {
        return new Response('Missing code', { status: 400 });
    }

    try {
        const redirectUri = process.env.SCALEKIT_REDIRECT_URI!;

        const authResult = await scalekit.authenticateWithCode(code, redirectUri);

        const { user, idToken } = authResult;

        const claims = await scalekit.validateToken(idToken);

        const organizationId = (claims as any).organization_id || (claims as any).org_id || (claims as any).oid || null;

        if (!organizationId) {
            return NextResponse.json('Missing organization_id', { status: 400 });
        }

    } catch (error) {

    }

}