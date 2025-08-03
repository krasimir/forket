"use client";

import React from 'react';

type LoginFormProps = {
  login: (formData: FormData) => Promise<void>
};

export default function LoginForm({ login }: LoginFormProps) {
  return (
    <form action={login}>
      <div>
        <label htmlFor="username" className="block mb1">
          You are not logged in.
          <br />
          Please type your name:
        </label>
        <input type="text" id="username" name="username" required placeholder="Your name here" autoFocus />
      </div>
      <button type="submit" className="mt2">
        Login
      </button>
    </form>
  );
}