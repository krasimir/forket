const path = require('path');
const fs = require('fs');

module.exports = async function ({ transform, test }) {
  const inputFile = path.join(__dirname, "src", "input.js");
  const result = await transform(fs.readFileSync(inputFile, "utf8"), "client", inputFile, true);

  test('Should recognize the file for client usage because of "react-dom/client" usage', () => {
    return result.meta.useClient;
  });
  test('Should properly find the import/require statements', () => {
    return result.meta.imports.map(i => i.source).join(',') === 'react,react-dom/client,./components/App,utils/anotherModule,utils/testModule';
  });
};