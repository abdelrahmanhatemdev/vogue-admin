"use client";
import { login } from "@/actions/Auth";
import { auth } from "@/firebase/firebase.config";
import useAuth from "@/hooks/useAuth";
import { notify } from "@/lib/utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, FormEvent, useState } from "react";

const Login = () => {
  const checkUser = useAuth();

  console.log("checkUser", checkUser);
  console.log("auth.currentUser", auth.currentUser);
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const canAdd: boolean = [email, password].every(Boolean);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {email, password}
    const res: ActionResponse = await login(data)
    notify(res);

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
