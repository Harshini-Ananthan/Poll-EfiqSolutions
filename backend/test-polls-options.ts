import { db } from './src/config/firebase';

async function run() {
  try {
    const snapshot = await db.collection('votes').get();
    for (const doc of snapshot.docs) {
      const vote = doc.data();
      const pollDoc = await db.collection('polls').doc(vote.pollId).get();
      const optionDoc = await db.collection('polls').doc(vote.pollId).collection('options').doc(vote.optionId).get();
      console.log(`Vote ${doc.id}: pollExists=${pollDoc.exists}, optionExists=${optionDoc.exists}`);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
