import { printGraph } from "./graph.js";
import { ROLE } from "./constants.js";

export function setRoles(node) {
  function visitNode(node) {
    if (node.useClient) {
      node.role = ROLE.CLIENT;
    }
    if (node.children.length > 0) {
      node.children.forEach(child => {
        if (node.role === ROLE.CLIENT) {
          child.role = ROLE.CLIENT;
        }
        visitNode(child);
      });
    }
  }
  visitNode(node);
}