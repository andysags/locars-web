import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection("cars")
      .where("is_approved", "==", false)
      .get();
    const cars = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: "Failed to find cars" }, { status: 500 });
  }
}
