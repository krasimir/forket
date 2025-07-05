const { printGraph } = require("./graph.js");
const { ROLE_CLIENT, ROLE_SERVER, ROLE_SHARED } = require("./constants.js");

function setRoles(node) {
  function visitNode(node) {
    if (node.useClient) {
      node.role = ROLE_CLIENT;
    }
    if (node.children.length > 0) {
      node.children.forEach(child => {
        if (node.role === ROLE_CLIENT) {
          child.role = ROLE_CLIENT;
        }
        visitNode(child);
      });
    }
  }
  visitNode(node);
  printGraph(node);
}

module.exports = {
  setRoles
}