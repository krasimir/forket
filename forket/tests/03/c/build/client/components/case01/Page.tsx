"use client";
import React from 'react';
const saveData = function(...args) {
    return window.FSA_call("$FSA_f_11_saveData", "saveData")(...args);
};
export default function Page() {
    return (<button onClick={saveData}></button>);
}
