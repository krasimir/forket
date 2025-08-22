"use client";
import React, { use } from 'react';

export default function Footer({ numOfNotes }) {
  const num = use(numOfNotes);
  return (
    <footer className="footer">
      <p className="text-center">
        {num} {num === 1 ? 'note' : 'notes'} in total
      </p>
    </footer>
  )
}