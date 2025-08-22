"use client";
import { useState } from "react";
const andMore = function(...args) {
    return window.FSA_call("$FSA_andMore", "andMore")(...args);
};
const somethingElse = function(...args) {
    return window.FSA_call("$FSA_somethingElse", "somethingElse")(...args);
};
const getNodes2 = function(...args) {
    return window.FSA_call("$FSA_getNodes2", "getNodes2")(...args);
};
const getNodes = function(...args) {
    return window.FSA_call("$FSA_getNodes", "getNodes")(...args);
};
const superSaveNote = function(...args) {
    return window.FSA_call("$FSA_superSaveNote", "superSaveNote")(...args);
};
const saveNote = function(...args) {
    return window.FSA_call("$FSA_saveNote", "saveNote")(...args);
};
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
