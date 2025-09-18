const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID
  }),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.database();

const testConnection = async () => {
  try {
    await db.ref("/").once("value");
    console.log("Firebase connected successfully");
  } catch (err) {
    console.error("Firebase connection failed:", err);
  }
};

module.exports = { db, testConnection };
