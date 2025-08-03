import React from 'react';
import { getProducts } from "./db";
import ProductsList from "./ProductsList";

export default async function Products() {
  const { products } = await getProducts();

  return (
    <ProductsList products={products}>
      <ListOfProducts n={products.length}/>
    </ProductsList>
  );
}

function ListOfProducts({ n }: { n: number }) {
  return <p>All products: {n}</p>;
}
