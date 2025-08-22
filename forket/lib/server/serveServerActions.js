export default function forketServerActions(handler) {
  if (!handler) {
    throw new Error(`‎𐂐 Forket: something is wrong with the server actions handler. Check your server entry point.`);
  }
  return handler;
}
