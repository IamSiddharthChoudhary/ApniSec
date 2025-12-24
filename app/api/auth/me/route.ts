import { NextRequest, NextResponse } from "next/server";
import { Auth } from "../../utils/authClass";

const auth = new Auth();

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tk = authHeader.split(" ")[1];
    const user = await auth.getCurUser(tk);

    return NextResponse.json(
      { user: user, message: "Successful" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
