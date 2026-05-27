import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try to dynamically import admin module and write to Firestore if available.
    try {
      const adminMod = await import('@/lib/firebase-admin');
      const isConfigured = typeof adminMod.isAdminConfigured === 'function' ? adminMod.isAdminConfigured() : false;
      if (isConfigured) {
        const adminDb = typeof adminMod.getAdminDb === 'function' ? adminMod.getAdminDb() : null;
        if (adminDb) {
          const docRef = await adminDb.collection('contact_messages').add({
            name,
            email,
            message,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          });
          return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
        }
      }
    } catch (err: any) {
      // dynamic import or firestore write failed — fallthrough to backup
      console.warn('Firebase Admin write failed or not configured:', err?.message || err);
    }

    // Fallback: append to a local backup file and return success.
    try {
      const backupDir = path.resolve(process.cwd(), 'tmp');
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
      const file = path.join(backupDir, 'contact_messages_backup.jsonl');
      const payload = {
        name,
        email,
        message,
        status: 'PENDING_BACKUP',
        createdAt: new Date().toISOString(),
        source: 'fallback',
      };
      fs.appendFileSync(file, JSON.stringify(payload) + "\n");
      console.warn('Firebase Admin not configured — saved contact message to', file);
      return NextResponse.json({ success: true, backup: true }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Failed backup' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
