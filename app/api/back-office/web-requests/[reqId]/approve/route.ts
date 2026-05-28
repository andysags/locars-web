import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ reqId: string }> },
) {
  try {
    const db = getAdminDb();
    const auth = getAdminAuth();
    if (!db || !auth) {
      return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 500 });
    }
    const { reqId } = await params;
    const data = await req.json();

    // Create random password
    const tempPassword = Math.random().toString(36).slice(-8) + "!Loc";

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email: data.email,
      password: tempPassword,
      displayName: `${data.firstName} ${data.lastName}`,
    });

    // Create Locars user document
    await db.collection("users").doc(userRecord.uid).set({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      account_type: data.type,
      is_approved: true,
      created_at: new Date(),
    });

    // Mark request as processed
    await db.collection("web_host_requests").doc(reqId).update({
      status: "approved",
      user_id: userRecord.uid,
    });

    // Note: Here you would integrate an email API (SendGrid, Mailgun, etc.) to
    // send the temporary password to the user. For demonstration, we just return it.
    // console.log(`Sending email to ${data.email} with password ${tempPassword}`);

    return NextResponse.json({ success: true, tempPassword });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
