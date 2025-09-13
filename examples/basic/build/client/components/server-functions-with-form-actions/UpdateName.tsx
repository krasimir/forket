"use client";
import React, { useState, useActionState } from "react";
const updateUsername = function(...args) {
    return window.FSA_call("$FSA_f_55_updateUsername", "updateUsername")(...args);
};
export default function UpdateName() {
    const [name, setName] = useState("");
    const [state, submitAction, isPending] = useActionState(updateUsername, {
        error: null
    });
    console.log(state);
    return (<form action={submitAction}>
      <input type="text" name="name" disabled={isPending} value={name} onChange={(e)=>setName(e.target.value)} placeholder="type your name here"/>
      {state.error && <p style={{
        color: "red"
    }}>{state.error}</p>}
    </form>);
}
