import { NextRequest, NextResponse } from "next/server";
import { SbDataClient } from "../../utils/sbDataClient";
import { Auth } from "../../utils/authClass";
import { headers } from "next/headers";
import { RateLimiter } from "../../utils/rateLimiter";

const sbDataClient = new SbDataClient();
const rateLimiter = new RateLimiter();
const auth = new Auth();
await rateLimiter.init();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tk = authHeader.split(" ")[1];
    const user = await auth.getCurUser(tk);

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0] ||
      h.get("x-real-ip") ||
      "unknown";

    const st = await rateLimiter.addReq(ip);
    if (st === 429) {
      return NextResponse.json(
        { message: "Too many requests" },
        { status: 429 }
      );
    }

    const r = await req.json();
    const { email, status } = r;
    const id = Number(params.id);

    if (!email || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (email !== user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const res = await sbDataClient.updateStatus(email, status, id);
    if (res === -1) {
      return NextResponse.json(
        { message: "Error updating status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Success" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tk = authHeader.split(" ")[1];
    const user = await auth.getCurUser(tk);

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0] ||
      h.get("x-real-ip") ||
      "unknown";

    const st = await rateLimiter.addReq(ip);
    if (st === 429) {
      return NextResponse.json(
        { message: "Too many requests" },
        { status: 429 }
      );
    }

    const r = await req.json();
    const { email } = r;

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    if (email !== user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const res = await sbDataClient.deletePost(email, Number(params.id));
    if (res === -1) {
      return NextResponse.json({ message: "Error deleting" }, { status: 500 });
    }

    return NextResponse.json({ message: "Success" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
