import { useState } from 'react';
async function App() {
    return /*#__PURE__*/ React.createElement("p", {
        className: "mt-1"
    }, "Hello");
}
const Comp2 = async ()=>{
    const [state, setState] = useState('initial');
    return /*#__PURE__*/ React.createElement("span", {
        className: "mt-1"
    }, state);
};
const Comp3 = async ()=>{
    const [state, setState] = useState("initial");
    if (state === "initial") {
        return /*#__PURE__*/ React.createElement("span", {
            className: "mt-1"
        }, state);
    }
    return null;
};
