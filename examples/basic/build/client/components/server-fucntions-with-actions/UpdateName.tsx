"use client";
import React, { useState, useTransition } from "react";
const updateName = function(...args) {
    return window.FSA_call("$FSA_updateName", "updateName")(...args);
};
export default function UpdateName() {
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();
    const submitAction = async ()=>{
        startTransition(async ()=>{
            const response = await updateName(name);
            console.log("Response from updateName:", response);
            if (response.error) {
                setError(response.error);
            } else {
                setError(null);
                setName("");
            }
        });
    };
    return (<form action={submitAction}>
      <input type="text" name="name" disabled={isPending} value={name} onChange={(e)=>setName(e.target.value)} placeholder="type your name here"/>
      {error && <span>Failed: {error}</span>}
    </form>);
}
