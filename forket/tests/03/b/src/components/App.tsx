import React from "react";

import Note from './Note';
import { saveNote } from "../server-actions/db.js";

export default async function App() {
  return <Note saveNote={saveNote}/>;
}