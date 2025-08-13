let id = 0;
export default function getId() {
  return "f_" + id++;
}
export function resetId() {
  id = 0;
}