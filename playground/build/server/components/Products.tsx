import React from 'react';
import { getProducts } from "./db";
import ProductsList from "./ProductsList";
function serialize$Props(props) {
    function isValidElement(obj) {
        const keys = Object.keys(obj);
        return (typeof obj === "object" && obj !== null && keys.includes("_owner") && keys.includes("_store") && keys.includes("props"));
    }
    if (props == null || typeof props !== "object") return props;
    if (Array.isArray(props)) {
        return props.map(serialize$Props);
    }
    if (isValidElement(props)) {
        return false;
    }
    const serialized = {};
    for(const key in props){
        const value = props[key];
        if (typeof value === "function") {
            continue;
        }
        const serializedProp = serialize$Props(value);
        if (serializedProp !== false) {
            serialized[key] = serialize$Props(value);
        }
    }
    return serialized;
}
function ProductsListBoundary(props) {
    const serializedProps = JSON.stringify(serialize$Props(props));
    const children = props.children || [];
    return (<>
      <boundary_f_0>
        <ProductsList {...props} children={<boundary_children_f_0>{children}</boundary_children_f_0>}/>
      </boundary_f_0>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
  const serializedProps = ${serializedProps};
  if (typeof $FRSC !== 'undefined') return $FRSC(["f_0", "ProductsList", serializedProps]);
  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
  $FRSC_.push(["f_0", "ProductsList", serializedProps]);
})();`
    }}/>
    </>);
}
const CREDENTIALS = "secret";
console.log(CREDENTIALS);
export default async function Products() {
    const { products } = await getProducts();
    return (<ProductsListBoundary products={products}>
      <ListOfProducts n={products.length}/>
    </ProductsListBoundary>);
}
function ListOfProducts({ n }) {
    return <p>All products: {n}</p>;
}
