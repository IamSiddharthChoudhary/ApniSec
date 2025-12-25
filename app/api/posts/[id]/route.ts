import { NextRequest, NextResponse } from "next/server";
import { SbDataClient } from "../../utils/sbDataClient";
import { Auth } from "../../utils/authClass";

const sbDataClient = new SbDataClient();
const auth = new Auth();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tk = authHeader.split(" ")[1];
    const user = await auth.getCurUser(tk);

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("PUT /api/posts/[id] - Updating:", {
      id: params.id,
      email: user.email,
      status,
    });

    const res = await sbDataClient.updateStatus(user.email, status, params.id);

    if (res === -1) {
      return NextResponse.json(
        {
          message: "Failed to update",
          debug: { id: params.id, email: user.email },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Status updated" }, { status: 200 });
  } catch (e: any) {
    console.error("PUT /api/posts/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tk = authHeader.split(" ")[1];
    const user = await auth.getCurUser(tk);

    console.log("DELETE /api/posts/[id] - Deleting:", {
      id: params.id,
      email: user.email,
    });

    const res = await sbDataClient.deletePost(user.email, params.id);

    if (res === -1) {
      return NextResponse.json(
        {
          message: "Failed to delete",
          debug: { id: params.id, email: user.email },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (e: any) {
    console.error("DELETE /api/posts/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tk = authHeader.split(" ")[1];
    await auth.getCurUser(tk);

    console.log("GET /api/posts/[id] - Fetching:", { id: params.id });

    const post = await sbDataClient.getPostById(params.id);

    if (!post || post === -1) {
      return NextResponse.json(
        {
          message: "Not found",
          debug: { id: params.id },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (e: any) {
    console.error("GET /api/posts/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
