import React from "react";

export default function ProductListeItem({ title, onClick }: { title: string; onClick: (e: any) => void }) {
  return (
    <label>
      <input type="checkbox" onClick={onClick} />
      {title}
    </label>
  );
}