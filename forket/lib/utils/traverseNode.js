export default function traverseNode(node, visitors, parent = null) {
  if (!node || typeof node.type !== "string") return;

  const visitor = visitors[node.type];
  if (visitor) {
    visitor(node, parent);
  }

  for (const key in node) {
    if (!node.hasOwnProperty(key)) continue;

    const child = node[key];

    if (Array.isArray(child)) {
      child.forEach((c) => {
        if (c && typeof c.type === "string") {
          traverseNode(c, visitors, node);
        }
      });
    } else if (child && typeof child.type === "string") {
      traverseNode(child, visitors, node);
    }
  }
};