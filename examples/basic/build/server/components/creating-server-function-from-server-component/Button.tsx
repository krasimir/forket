"use client";
import React from "react";

export default function Button({ onClick }) {
  return <button onClick={() => {
    onClick().then(console.log);
  }}>Create Empty Note</button>;
}
