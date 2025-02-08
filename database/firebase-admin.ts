import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || "{}");

const app = getApps().length > 0 
  ? getApp() 
  : initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET, 
    });

const adminStorage = getStorage().bucket(process.env.FIREBASE_ADMIN_STORAGE_BUCKET);
const adminDB = getFirestore();
const adminAuth = getAuth();

export { adminStorage, adminDB, adminAuth };
