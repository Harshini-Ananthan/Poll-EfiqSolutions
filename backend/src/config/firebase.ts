import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

if (!admin.apps.length) {
  const credential = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
    ? admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    : fs.existsSync(serviceAccountPath)
      ? admin.credential.cert(serviceAccountPath)
      : undefined;

  if (!credential) {
    throw new Error('Firebase Admin credentials are missing. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
  }

  admin.initializeApp({
    credential,
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
