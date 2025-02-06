import { useState, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/database/firebase";
import axios from "axios";


export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await result.user.getIdToken();
    const res = await axios.post("/api/auth/login", { idToken });
    const user = {...result.user, isAdmin: res.data.isAdmin}
    setUser(user);
    return user
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    await signOut(auth);
    setUser(null);
  };

  return { user, login, logout };
}
