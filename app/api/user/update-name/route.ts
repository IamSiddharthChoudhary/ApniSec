import { NextRequest, NextResponse } from "next/server";
import { Auth } from "../../utils/authClass";
import { ResendEmail } from "../../utils/email";
import { SbAuthClient } from "../../utils/sbAuthClient";

const auth = new Auth();
const emailService = new ResendEmail();
const authClient = new SbAuthClient();

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tk = authHeader.split(" ")[1];
    const user = await auth.getCurUser(tk);

    const { name } = await req.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await authClient.updateName(user.email, name);
    await emailService.sendProfileUpdated(user.email, name, ["name"]);

    return NextResponse.json(
      { message: "Name updated successfully", name },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to update name" },
      { status: 500 }
    );
  }
}
