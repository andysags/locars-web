import * as admin from "firebase-admin";

function hasFirebaseAdminConfig() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY,
  );
}

function getOrInitAdminApp(): admin.app.App {
  if (admin.apps.length) {
    return admin.app();
  }

  if (!hasFirebaseAdminConfig()) {
    throw new Error(
      "Missing Firebase Admin environment variables. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export function getAdminDb() {
  const app = getOrInitAdminApp();
  return app.firestore();
}

export function getAdminAuth() {
  const app = getOrInitAdminApp();
  return app.auth();
}
