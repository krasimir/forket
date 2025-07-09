import React from 'react';
import { getProducts } from "./db";
function ClientBoundary(id, componentName) {
    return (props)=>(<template data-client-component data-id={id} data-component={componentName} data-props={JSON.stringify(props)}/>);
}
const ProductsList = ClientBoundary("T:0", "ProductsList");
const CREDENTIALS = "secret";
console.log(CREDENTIALS);
export default async function Products() {
    const { products } = await getProducts();
    return (<ProductsList products={products}>
      <ListOfProducts n={products.length}/>
    </ProductsList>);
}
function ListOfProducts({ n }) {
    return <p>All products: {n}</p>;
}
