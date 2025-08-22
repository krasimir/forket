"use client";
import { useState } from "react";
const andMore = window.FSA_call("$FSA_andMore", "andMore");
const somethingElse = window.FSA_call("$FSA_somethingElse", "somethingElse");
const getNodes2 = window.FSA_call("$FSA_getNodes2", "getNodes2");
const getNodes = window.FSA_call("$FSA_getNodes", "getNodes");
const superSaveNote = window.FSA_call("$FSA_superSaveNote", "superSaveNote");
const saveNote = window.FSA_call("$FSA_saveNote", "saveNote");
export default function Expandable() {
    const nodes = getNodes();
    const nodes2 = getNodes2();
    const a = somethingElse();
    const b = andMore();
    const c = superSaveNote();
    return (<div>
      <button onClick={()=>{
        saveNote({
            data: [
                "This is a note"
            ]
        });
    }}>Save</button>      
    </div>);
}
