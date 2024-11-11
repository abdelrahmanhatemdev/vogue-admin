"use client";
import { auth } from "@/firebase/firebase.config";
import useAuth from "@/hooks/useAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, FormEvent, useState } from "react";

const Login = () => {
  const checkUser = useAuth();

  console.log("checkUser", checkUser);
  console.log("auth.currentUser", auth.currentUser);
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const canAdd: boolean = [email, password].every(Boolean);

  function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log("user", user.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <form onSubmit={handleAdd}>
      <input
        placeholder="Enter Email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        autoComplete="email"
        type="email"
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />
      <button type="submit" disabled={!canAdd} className="p-2">
        Login
      </button>
    </form>
  );
};
export default Login;
