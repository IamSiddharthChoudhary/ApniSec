import { NextRequest, NextResponse } from "next/server";
import { SbDataClient } from "../utils/sbDataClient";
import { ResendEmail } from "../utils/email";
import { RateLimiter } from "../utils/rateLimiter";
import { Auth } from "../utils/authClass";
import { headers } from "next/headers";

const sbDataClient = new SbDataClient();
const resend = new ResendEmail();
const rateLimiter = new RateLimiter();
const auth = new Auth();
await rateLimiter.init();

export async function GET(req: NextRequest) {
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

    const status = await rateLimiter.addReq(ip);
    if (status === 429) {
      return NextResponse.json(
        { message: "Too many requests" },
        { status: 429 }
      );
    }

    let posts: any[] | null;
    const { searchParams: sp } = new URL(req.url);
    const email = sp.get("email");
    const start = sp.get("start");
    const end = sp.get("end");
    const type = sp.get("type");

    if (start && end) {
      posts = await sbDataClient.getDataPageWise(Number(start), Number(end));
    } else if (email) {
      posts = await sbDataClient.getuserSpecificPosts(email);
    } else if (type) {
      posts = await sbDataClient.getPostsByType(type);
    } else {
      posts = await sbDataClient.getAllPosts();
    }

    if (posts && posts[0] === -1) {
      return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
    }

    return NextResponse.json({ message: "Success", posts: posts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const status = await rateLimiter.addReq(ip);
    if (status === 429) {
      return NextResponse.json(
        { message: "Too many requests" },
        { status: 429 }
      );
    }

    const r = await req.json();
    const { email, title, desc, type } = r;

    if (!email || !title || !desc || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await sbDataClient.addPost(email, title, desc, type);
    if (res === -1) {
      return NextResponse.json({ message: "Error Posting" }, { status: 500 });
    }

    await resend.sendIssueCreated(email, {
      id: res.toString(),
      type: type,
      description: desc,
      createdBy: email,
    });

    return NextResponse.json({ message: "Success", id: res });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
