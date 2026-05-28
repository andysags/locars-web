import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 500 });
    }
    const snapshot = await db
      .collection("web_host_requests")
      .where("status", "==", "pending")
      .get();
    return NextResponse.json(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    );
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
