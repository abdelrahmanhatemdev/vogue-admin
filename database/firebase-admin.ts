import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_CREDENTIALS || "{}"
);

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert(serviceAccount),
      });

const adminAuth = getAuth(app);

const adminStorage = getStorage(app)
const adminDB = getFirestore(app)

export { adminAuth, adminStorage, adminDB };
