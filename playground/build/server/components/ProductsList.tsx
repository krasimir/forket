"use client";
import React, { useState, use } from "react";
function ClientBoundary(id, componentName) {
    return (props)=>(<template data-client-component data-id={id} data-component={componentName} data-props={JSON.stringify(props)}/>);
}
const ProductListeItem = ClientBoundary("T:0", "ProductListeItem");
type Product = {
    id: number;
    title: string;
};
type ProductsProps = {
    products: Product[];
    children: any;
};
export default function ProductsList({ products, children }: ProductsProps) {
    const [selected, setSelected] = useState<Number[]>([]);
    const addToCart = (ids: Number[])=>({
            products: ids.length
        });
    function itemClicked(product: Product) {
        const index = selected.indexOf(product.id);
        if (index === -1) {
            setSelected([
                ...selected,
                product.id
            ]);
        } else {
            setSelected(selected.filter((id)=>id !== product.id));
        }
    }
    async function buy() {
        const { products } = await addToCart(selected);
        alert(`Added ${products} items to cart`);
    }
    if (products.length === 0) {
        return null;
    }
    return (<>
      {children}
      <p>Selected items: {selected.length}</p>
      <ul>
        {products.map((product: any)=>(<li key={product.id}>
            <ProductListeItem title={product.title} onClick={(e)=>itemClicked(product)}/>            
          </li>))}
      </ul>
      <button onClick={buy}>Add to cart</button>
    </>);
}
