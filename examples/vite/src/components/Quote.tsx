"use client";
import React, { useState, useTransition } from "react";
import { getQuote } from "../server-actions/quotes";

type Quote = {
  text: string;
  author: string;
}

export default function Quote({ quote }: { quote: Quote }) {
  const [q, setQuote] = useState<{ text: string; author: string }>(quote);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto" style={{ maxWidth: 600 }}>
      <h1 className="tac">{q.text}</h1>
      <p className="b tac">{q.author}</p>
      <button className="b my2 mx-auto" style={{ width: '250px' }}
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            setQuote(await getQuote());
          });
        }}
      >
        Get some more wisdom!
      </button>
    </div>
  );
}
