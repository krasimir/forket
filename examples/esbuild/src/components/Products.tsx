import React from 'react';
import { getProducts } from "./db.js";
import ProductsList from "./ProductsList.js";

export default async function Products() {
  const { products } = await getProducts();

  return (
    <ProductsList products={products}>
      <ListOfProducts n={products.length}/>
    </ProductsList>
  );
}

function ListOfProducts({ n }) {
  return <p>All products: {n}</p>;
}
