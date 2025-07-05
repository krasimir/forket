import React from "react";

export default function ProductListeItem({ title, onClick }) {
  return (
    <label>
      <input type="checkbox" onClick={onClick} />
      {title}
    </label>
  );
}