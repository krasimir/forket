"use client"
import { useState } from "react";

import { saveNote, superSaveNote } from "../server-actions/db.js";
import getNodes from "../server-actions/db.js";

const getNodes2 = require("../server-actions/db.js");
const { somethingElse, andMore } = require("../server-actions/db.js");

export default function Expandable() {
  const nodes = getNodes();
  const nodes2 = getNodes2();
  const a = somethingElse();
  const b = andMore();
  const c = superSaveNote();
  return (
    <div>
      <button onClick={() => {
        saveNote({ data: ["This is a note"] });
      }}>Save</button>      
    </div>
  );
}
