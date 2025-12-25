import { NextRequest, NextResponse } from "next/server";
import { Auth } from "../../utils/authClass";
import { ResendEmail } from "../../utils/email";

const auth = new Auth();
const resend = new ResendEmail();

export async function POST(req: NextRequest) {
  try {
    const r = await req.json();
    const { email, password } = r;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { user, tk } = await auth.login(email, password);

    resend
      .sendLoginNotification(email, user.name)
      .catch((e) => console.error("Login email failed:", e));

    return NextResponse.json(
      { token: tk, user: user, message: "Successful" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
