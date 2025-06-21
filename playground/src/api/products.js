import products from "./products.json";

export default async function (req, res) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  res.json(products);
}
