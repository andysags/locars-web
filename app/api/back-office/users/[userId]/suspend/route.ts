import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 500 });
    }
    const { userId } = await params;
    const { reason } = await req.json();

    await db.collection("users").doc(userId).update({
      is_suspended: true,
      suspension_reason: reason,
      updated_at: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to suspend user" }, { status: 500 });
  }
}
