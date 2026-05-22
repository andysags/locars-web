import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const db = getAdminDb();
    const { userId } = await params;
    const { reason, email } = await req.json();

    await db.collection("users").doc(userId).update({
      is_approved: false,
      rejection_reason: reason,
      updated_at: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reject user" }, { status: 500 });
  }
}
