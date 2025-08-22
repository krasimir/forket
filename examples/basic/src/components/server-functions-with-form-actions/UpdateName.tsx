"use client";
import React, { useState, useActionState } from "react";

import { updateUsername } from "./actions.js";

export default function UpdateName() {
  const [name, setName] = useState("");
  const [state, submitAction, isPending] = useActionState(updateUsername, { error: null });

  return (
    <form action={submitAction}>
      <input
        type="text"
        name="name"
        disabled={isPending}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="type your name here"
      />
    </form>
  );
}
