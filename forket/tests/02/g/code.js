async function A() {
  "use server";
}
const B = function () {
  "use server";
};
const C = () => {
  "use server";
};
export async function D() {
  "use server";
}
export default async function E() {
  "use server";
}

function EmptyNote() {
  async function F() {
    "use server";
  }
  const G = function () {
    "use server";
  };
  const H = () => {
    "use server";
  };
  return (
    <>
      <Button onClick={A} />
      <Button onClick={B} />
      <Button onClick={C} />
      <Button onClick={D} />
      <Button onClick={E} />
      <Button onClick={F} />
      <Button onClick={G} />
      <Button onClick={H} />
    </>
  );
}
