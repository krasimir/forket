"use client";
import { hydrateRoot } from "react-dom/client";
import { createElement } from "react";
import EmptyNote from "./components/EmptyNote.tsx";
window.__createElement = createElement;
window.__hydrateRoot = hydrateRoot;
window.EmptyNote = EmptyNote;
if (typeof window.FRSC_init === "function") {
    window.FRSC_init();
}
