import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
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
