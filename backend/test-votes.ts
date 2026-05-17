import { db } from './src/config/firebase';

async function run() {
  try {
    const snapshot = await db.collection('votes').get();
    console.log(`Found ${snapshot.size} total votes.`);
    snapshot.docs.forEach(doc => {
      console.log(doc.id, doc.data());
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
