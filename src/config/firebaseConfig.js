const admin = require("firebase-admin");

const serviceAccount = require("../../krumble-b68de-firebase-adminsdk-2ygz4-4c97a9c745.json");
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const storage = admin.storage(app);
const testBucket = storage.bucket("test");

module.exports = { testBucket };
