"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient.config";

export default function AddUser() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const canAdd: boolean = [email, password, passwordConfirm].every(Boolean);

  function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
    .then(user => {
        console.log("user", user);
    })
    .catch(err => {
        console.log(err);
    })
  }
  return (
    <form onSubmit={handleAdd}>
      <input
        type="text"
        placeholder="Enter Email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />
      <input
        type="password"
        placeholder="password-confirm"
        value={passwordConfirm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPasswordConfirm(e.target.value)
        }
      />
      <button type="submit" disabled={!canAdd} className="bg-red-200 p-2">
        Add
      </button>
    </form>
  );
}
