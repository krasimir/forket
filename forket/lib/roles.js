const { printGraph } = require("./graph.js");
const { ROLE } = require("./constants.js");

function setRoles(node) {
  function visitNode(node) {
    if (node.useClient) {
      node.role = ROLE.CLIENT_COMPONENT;
    }
    if (node.clientFile) {
      node.role = ROLE.CLIENT_FILE;
    }
    if (node.children.length > 0) {
      node.children.forEach(child => {
        if (node.role === ROLE.CLIENT_COMPONENT) {
          child.role = ROLE.CLIENT_COMPONENT;
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