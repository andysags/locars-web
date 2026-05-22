import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection("users")
      .where("is_approved", "==", false)
      .get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to find users" },
      { status: 500 },
    );
  }
}
