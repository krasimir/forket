"use client";
import React from 'react';
const createNote = function(...args) {
    return window.FSA_call("$FSA_f_53_createNote", "createNote")(...args);
};
export default function EmptyNote() {
    return <button onClick={()=>createNote().then(console.log)}>Create note</button>;
}
