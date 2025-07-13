import React from 'react';
import { getProducts } from "./db";
import ProductsList from "./ProductsList";
function serialize$Props(props) {
    return JSON.stringify(props);
}
function ProductsListBoundary(props) {
    const serializedProps = serialize$Props(props);
    return (<>
      <boundary_f_0>
        <ProductsList {...props}/>
      </boundary_f_0>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
  if (typeof $FRSC !== 'undefined') return $FRSC(["f_0", "ProductsList", ${serializedProps}]);
  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
  $FRSC_.push(["f_0", "ProductsList", ${serializedProps}]);
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
