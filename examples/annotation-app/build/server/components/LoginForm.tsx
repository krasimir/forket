"use client";

import React, { useState, useTransition } from 'react';

type LoginFormProps = {
  login: Function
};

export default function LoginForm({ login }: LoginFormProps) {
  const [ isPending, startTransition ] = useTransition();
  const [ error, setError ] = useState<string | null>(null);

  async function formSubmit(data: FormData) {
    startTransition(async () => {
      if (!(await login(data))) {
        setError('Ops! Something went wrong. Please try again later.');
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
          I need to know your name.
        </label>
        <input type="text" id="name" name="name" required placeholder="Your name" autoFocus disabled={isPending} />
      </div>
      <button type="submit" className="mt2" disabled={isPending}>
        {isPending ? "Please wait ..." : "Let's go!"}
      </button>
    </form>
  );
}