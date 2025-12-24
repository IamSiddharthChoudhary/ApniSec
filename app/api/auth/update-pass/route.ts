import { NextRequest, NextResponse } from "next/server";
import { SbAuthClient } from "../../utils/sbAuthClient";

const authClient = new SbAuthClient();

export async function PUT(req: NextRequest) {
  try {
    const { email, oldPassword, newPassword } = await req.json();

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await authClient.updatePassword(email, oldPassword, newPassword);

    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update password" },
      { status: 500 }
    );
  }
}
