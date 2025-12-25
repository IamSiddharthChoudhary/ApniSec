import { NextRequest, NextResponse } from "next/server";
import { SbAuthClient } from "../../utils/sbAuthClient";
import bcrypt from "bcryptjs";
import { Auth } from "../../utils/authClass";

const authClient = new SbAuthClient();
const auth = new Auth();

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tk = authHeader.split(" ")[1];
    const user = await auth.getCurUser(tk);

    const { oldPassword, newPassword } = await req.json();

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 500 });
    }
    const res = await authClient.updatePassword(
      user.email,
      oldPassword,
      newPassword
    );

    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update password" },
      { status: 500 }
    );
  }
}
