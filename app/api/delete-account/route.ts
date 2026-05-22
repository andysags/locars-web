import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { name, email, phone, reason, documentUrl } = await req.json();

    if (!name || !email || !phone || !documentUrl) {
      return NextResponse.json({ error: 'Missing required fields including identity document' }, { status: 400 });
    }

    const adminDb = getAdminDb();
    const docRef = await adminDb.collection('delete_requests').add({
      name,
      email,
      phone,
      documentUrl,
      reason: reason || '',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
