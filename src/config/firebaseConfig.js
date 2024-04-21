const admin = require("firebase-admin");

const serviceAccount = require("../../ServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const storage = admin.storage();
const bucket = storage.bucket();

module.exports = bucket;
