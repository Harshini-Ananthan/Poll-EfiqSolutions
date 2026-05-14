import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

const db = admin.firestore();

async function test() {
  const organizationId = 'org1';
  
  try {
    console.log('Testing polls list query...');
    await db.collection('polls')
      .where('organizationId', '==', organizationId)
      .orderBy('createdAt', 'desc')
      .get();
    console.log('Polls list query OK');
  } catch (e: any) {
    console.error('FAILED:', e.message);
  }
  process.exit(0);
}

test();
