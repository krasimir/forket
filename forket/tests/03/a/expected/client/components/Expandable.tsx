"use client";
import { useState } from "react";
export default function Expandable({ children, markAsRead }) {
    const [expanded, setExpanded] = useState(false);
    return (<div>
      <button onClick={()=>{
        setExpanded(!expanded);
        markAsRead();
    }}>Toggle</button>
      {expanded && children}
    </div>);
}
