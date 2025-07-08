import React from 'react';
import { getProducts } from "./components/db";
import ProductsList from "./components/ProductsList";

const CREDENTIALS = "secret";
console.log(CREDENTIALS)

export default async function Products() {
  const { products } = await getProducts();

  return <ProductsList products={products} />;
}
