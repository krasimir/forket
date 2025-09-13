"use client";
import React, { useState, useTransition, use } from "react";
const getQuote = function(...args) {
    return window.FSA_call("$FSA_f_11_getQuote", "getQuote")(...args);
};
type Quote = {
    text: string;
    author: string;
};
type Props = {
    quote: Quote;
    totalNumberOfQuotes: Promise<number>;
};
export default function Quote({ quote, totalNumberOfQuotes }: Props) {
    const [q, setQuote] = useState<{
        text: string;
        author: string;
    }>(quote);
    const [isPending, startTransition] = useTransition();
    const total = use(totalNumberOfQuotes);
    return (<div className="mx-auto" style={{
        maxWidth: 600
    }}>
      <h1 className="tac">{q.text}</h1>
      <p className="b tac">{q.author}</p>
      <button className="b my2 mx-auto" style={{
        width: "250px"
    }} disabled={isPending} onClick={()=>{
        startTransition(async ()=>{
            setQuote(await getQuote());
        });
    }}>
        Get some more wisdom!
      </button>
      <hr/>
      <p className="tac">Total number of quotes: {total.toLocaleString()}</p>
    </div>);
}
