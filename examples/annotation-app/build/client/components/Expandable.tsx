"use client";
import React, { useState } from "react";
export default function Expandable({ children, label }) {
    const [expanded, setExpanded] = useState(false);
    return (<div>
      <button onClick={()=>setExpanded(!expanded)} className="reset fz08">
        {label}
      </button>
      {expanded && children}
    </div>);
}
