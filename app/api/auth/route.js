import verifySession, { checkOrigin } from "@/util/serverUtilFunc";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req) {
  const originCheck = checkOrigin(req);
  if (!originCheck) {
    return new Response("Forbidden", { status: 403 });
  }
  const sessionDataRes = await verifySession();

  return NextResponse.json(sessionDataRes);
}
