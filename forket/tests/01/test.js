module.exports = function ({ assert, client, server }) {
  assert(() => {
    return client.meta.useClient;
  }, 'Should recognize the file as a client file because of "react-dom/client" usage');
}