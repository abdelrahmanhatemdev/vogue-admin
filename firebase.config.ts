import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore"


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_APP_FIRBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_APP_FIRBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_APP_FIRBASE_DTABASE_URL,
    projectId: process.env.NEXT_PUBLIC_APP_FIRBASE_PROJRCT_ID,
    storageBucket: process.env.NEXT_PUBLIC_APP_FIRBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_APP_FIRBASE_MASEGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_FIRBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_APP_FIRBASE_MEASUERMENT_ID,
  };

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)
