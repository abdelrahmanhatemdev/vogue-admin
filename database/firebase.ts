import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import { getAuth} from "firebase/auth"

const firebaseConfig = JSON.parse(process.env.FIREBASE_CREDENTIALS || "{}");

console.log("firebaseConfig", firebaseConfig);


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app)

export {db, storage, auth}
