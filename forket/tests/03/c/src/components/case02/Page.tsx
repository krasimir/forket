"use client";

import React from "react";

import { saveData } from "./actions.js";

export default function Page() {
  return <button onClick={saveData}></button>;
}
