import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
// import serviceAccount from "./serviceAccountKey.json"; // Download from Firebase Console

const app = initializeApp({
//   credential: cert(serviceAccount),
});

const adminAuth = getAuth(app);

export { adminAuth };