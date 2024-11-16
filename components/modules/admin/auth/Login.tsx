"use client";
import { loginUser } from "@/lib/authService";
import { ChangeEvent, FormEvent, useState } from "react";

const Login = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const canAdd: boolean = [email, password].every(Boolean);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await loginUser({ email, password });
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
