import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

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

export { adminAuth };
