import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const db = getAdminDb();
    const { userId } = await params;

    await db.collection("users").doc(userId).update({
      is_suspended: false,
      suspension_reason: null,
      updated_at: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to unsuspend user" }, { status: 500 });
  }
}
