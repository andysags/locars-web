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

    // Validate the user and set is_approved to true
    await db.collection("users").doc(userId).update({
      is_approved: true,
      updated_at: new Date(),
    });

    // TODO: Send validation email (Could use Nodemailer or the Firebase Trigger extension)
    // await sendWelcomeEmail(body.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to approve user" },
      { status: 500 },
    );
  }
}
