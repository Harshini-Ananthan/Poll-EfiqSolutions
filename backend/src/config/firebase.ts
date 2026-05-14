import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
