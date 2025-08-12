"use client";

import React, { useState } from 'react';

type LoginFormProps = {
  login: (formData: FormData) => Promise<Boolean>
};

export default function LoginForm({ login }: LoginFormProps) {
  const [ error, setError ] = useState<string | null>(null);

  async function formSubmit(data: FormData) {
    setError(null);
    try {
      if (!(await login(data))) {
        setError('Error in login, please try again.');
      }
    } catch(error) {
      setError("Error in login, please try again.");
    }
  }

  return (
    <form action={formSubmit}>
      {error && <div className="fz08 mb1 p1 error">{error}</div>}
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