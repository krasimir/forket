"use client";

import React, { useState, useTransition } from 'react';

type LoginFormProps = {
  login: Function
};

export default function LoginForm({ login }: LoginFormProps) {
  const [ isPending, startTransition ] = useTransition();
  const [ error, setError ] = useState<string | null>(null);

  async function formSubmit(data: FormData) {
    setError(null);
    startTransition(async () => {
      if (!(await login(data))) {
        setError('Error in login, please try again.');
        return;
      }
      window.location.reload();
    });
  }

  return (
    <form action={formSubmit} className="container-small mxauto">
      {error && <div className="fz08 mb1 p1 error">{error}</div>}
      <div>
        <label htmlFor="username" className="block mb1">
          You are not logged in.
          <br />
          Please type your name:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          placeholder="Your name here"
          autoFocus
          disabled={isPending}
        />
      </div>
      <button type="submit" className="mt2" disabled={isPending}>
        {isPending ? "Logging in ..." : "Login"}
      </button>
    </form>
  );
}