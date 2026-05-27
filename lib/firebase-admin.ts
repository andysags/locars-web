import * as admin from "firebase-admin";

function hasFirebaseAdminConfig() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY,
  );
}

/**
 * Try to initialize the admin app if config exists.
 * If config is missing, do not throw — return null so callers can fallback.
 */
function getOrInitAdminApp(): admin.app.App | null {
  if (admin.apps.length) {
    return admin.app();
  }

  if (!hasFirebaseAdminConfig()) {
    return null;
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
  if (!app) return null;
  return app.firestore();
}

export function getAdminAuth() {
  const app = getOrInitAdminApp();
  if (!app) return null;
  return app.auth();
}

export function isAdminConfigured() {
  return hasFirebaseAdminConfig();
}
