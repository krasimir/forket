export async function getProducts() {
  const res = await fetch("http://localhost:8087/api/products");
  const data = await res.json();
  return data;
}