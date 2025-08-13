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
        <p>
          Hey, my name is Ricardo. Your online AI assitant. I need to know your name and profession to help you better.
        </p>
        <label htmlFor="username" className="block mb1">
          Please type your name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Your name"
          autoFocus
          disabled={isPending}
        />
        <label htmlFor="job" className="block mb1 mt2">
          Your job:
        </label>
        <input
          type="text"
          id="job"
          name="job"
          required
          placeholder="Your job"
          disabled={isPending}
        />
      </div>
      <button type="submit" className="mt2" disabled={isPending}>
        {isPending ? "Please wait ..." : "Let's have a chat"}
      </button>
    </form>
  );
}