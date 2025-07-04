"use client";

import React, { useState, use } from "react";

type Product = {
  id: number;
  title: string;
};
type ProductsProps = {
  products: Product[];
};

export default function ProductsList({ products }: ProductsProps) {
  const [selected, setSelected] = useState<Number[]>([]);
  const addToCart = (ids: Number[]) => ({ products: ids.length });

  function itemClicked(product: Product) {
    const index = selected.indexOf(product.id);
    if (index === -1) {
      setSelected([...selected, product.id]);
    } else {
      setSelected(selected.filter((id) => id !== product.id));
    }
  }
  async function buy() {
    const { products } = await addToCart(selected);
    alert(`Added ${products} items to cart`);
  }

  if (products.length === 0) {
    return null;
  }
  return (
    <>
      <p>Selected items: {selected.length}</p>
      <ul>
        {products.map((product: any) => (
          <li key={product.id}>
            <label>
              <input type="checkbox" onClick={(e) => itemClicked(product)} />
              {product.title}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={buy}>Add to cart</button>
    </>
  );
}
