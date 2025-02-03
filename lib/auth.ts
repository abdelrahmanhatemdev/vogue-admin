import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/database/firebase";
import { adminAuth } from "@/database/firebase-admin";

// export const isAdmin = async (uid: string) => {
//   const user = await adminAuth.getUser(uid);
//   return user.customClaims?.admin === true;
// };

// export const verifyToken = async (token: string) => {
//   try {
//     return await adminAuth.verifyIdToken(token);
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return null;
//   }
// };

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  document.cookie = `auth_token=${token}; path=/; Secure; HttpOnly`;
  return userCredential;
};

export const logOut = async () => {
  document.cookie = "auth_token=; Max-Age=0; path=/;";
  return signOut(auth);
};