async function test() {
  const foo = await import("./A/B");
  const { default: bar } = await import("./A/B");
}
