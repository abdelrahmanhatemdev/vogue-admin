import { useState, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/database/firebase";
import axios from "axios";
import { FirebaseError } from "firebase/app";

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    )
      .then(async (result) => {
        if (result?.user) {
          const idToken = result.user.getIdToken();
          const res = await axios.post("/api/auth/login", { idToken });

          const user = { ...result.user, isAdmin: res.data.isAdmin };
          setUser(user);
          return user;
        }
      })
      .catch((error) => {
        let message = "Something went wrong.";

        if (error instanceof FirebaseError) {
          switch (error.code) {
            case "auth/invalid-credential":
              message = "Incorrect email or password.";
              break;
            case "auth/user-not-found":
              message = "No account found with this email.";
              break;
            case "auth/wrong-password":
              message = "Incorrect password.";
              break;
            case "auth/too-many-requests":
              message = "Too many attempts. Try again later.";
              break;
            default:
              message = error.message;
          }
        }

        console.error("Login error:", error);
        throw new Error(message);
      });
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    await signOut(auth);
    setUser(null);
  };

  return { user, login, logout };
}
