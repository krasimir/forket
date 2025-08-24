export default function forketServerActions(handler) {
  if (!handler) {
    throw new Error(
      `‎𐂐 "forketServerActions" method expects a handler. That's not something that you have to add manually. Is your server entry point file processed by Forket? Check for "server/forketServerActions.js" in your build directory. That's the function that needs to be passed here.`
    );
  }
  return handler;
}
