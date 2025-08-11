export default function traverseNode(node, visitors, stack = []) {
  if (!node || typeof node.type !== "string") {
    return;
  }

  const visitor = visitors[node.type];
  if (visitor) {
    visitor(node, stack);
  }

  for (const key in node) {
    if (!node.hasOwnProperty(key)) continue;

    const child = node[key];

    if (Array.isArray(child)) {
      child.forEach((c) => {
        if (c) {
          if (typeof c.type === "string") {
            traverseNode(c, visitors, [node].concat(stack));
          } else if (c?.expression && typeof c.expression.type === "string") {
            traverseNode(c.expression, visitors, [node].concat(stack));
          } else if (c?.callee && typeof c.callee.type === "string") {
            traverseNode(c.callee, visitors, [node].concat(stack));
          } else if (c?.left && typeof c.left.type === "string") {
            traverseNode(c.left, visitors, [node].concat(stack));
          } else if (c?.right && typeof c.right.type === "string") {
            traverseNode(c.right, visitors, [node].concat(stack));
          }
        }
      });
    } else if (child && typeof child.type === "string") {
      traverseNode(child, visitors, [node].concat(stack));
    }
  }
};