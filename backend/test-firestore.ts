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
  const organizationId = 'master-org'; // One of the orgs I seeded
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  try {
    console.log('Testing polls query...');
    // await db.collection('polls')
    //   .where('organizationId', '==', organizationId)
    //   .where('isActive', '==', true)
    //   .orderBy('createdAt', 'desc')
    //   .limit(1)
    //   .get();
    // console.log('Polls query OK');

    console.log('Testing votes query...');
    await db.collection('votes')
      .where('organizationId', '==', organizationId)
      .where('createdAt', '>=', startOfDay.toISOString())
      .get();
    console.log('Votes query OK');

  } catch (e: any) {
    console.error('FAILED:', e.message);
    if (e.details) console.error('DETAILS:', e.details);
  }
  process.exit(0);
}

test();
