"use client";
import React from 'react';
import { createNote } from "./actions.js";

export default function EmptyNote() {
  return <button onClick={() => createNote().then(console.log)}>Create note</button>;
}
