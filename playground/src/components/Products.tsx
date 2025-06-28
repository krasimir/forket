import React from 'react';
import { getProducts } from "./db";
import ProductsList from "./ProductsList";

const CREDENTIALS = "secret";
console.log(CREDENTIALS)

export default async function Products() {
  const { products } = await getProducts();

  return <ProductsList products={products} />;
}
