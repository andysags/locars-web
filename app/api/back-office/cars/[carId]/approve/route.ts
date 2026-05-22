import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ carId: string }> },
) {
  try {
    const db = getAdminDb();
    const { carId } = await params;
    await db.collection("cars").doc(carId).update({
      is_approved: true,
      updated_at: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to approve car" },
      { status: 500 },
    );
  }
}
