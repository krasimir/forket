"use client";
import { useState } from "react";
const andMore = function(...args) {
    return window.FSA_call("$FSA_f_17_andMore", "andMore")(...args);
};
const somethingElse = function(...args) {
    return window.FSA_call("$FSA_f_16_somethingElse", "somethingElse")(...args);
};
const getNodes2 = function(...args) {
    return window.FSA_call("$FSA_f_15_getNodes2", "getNodes2")(...args);
};
const getNodes = function(...args) {
    return window.FSA_call("$FSA_f_13_getNodes", "getNodes")(...args);
};
const superSaveNote = function(...args) {
    return window.FSA_call("$FSA_f_12_superSaveNote", "superSaveNote")(...args);
};
const saveNote = function(...args) {
    return window.FSA_call("$FSA_f_11_saveNote", "saveNote")(...args);
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
