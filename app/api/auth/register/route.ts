import { NextRequest, NextResponse } from "next/server";
import { Auth } from "../../utils/authClass";
import { ResendEmail } from "../../utils/email";
import { headers } from "next/headers";
import { RateLimiter } from "../../utils/rateLimiter";

const auth = new Auth();
const resend = new ResendEmail();
const rateLimiter = new RateLimiter();
await rateLimiter.init();

export async function POST(req: NextRequest) {
  try {
    const r = await req.json();
    const { name, email, password } = r;

    console.log("Register attempt:", { name, email });

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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

    await resend.sendWelcome(email, name);

    const { user, tk } = await auth.register(name, email, password);

    return NextResponse.json(
      { token: tk, user: user, message: "Successful" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
