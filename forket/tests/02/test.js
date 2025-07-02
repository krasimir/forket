const path = require('path');
const fs = require('fs');

module.exports = async function ({ transform, test }) {
  const inputFile1 = path.join(__dirname, "src", "input1.tsx");
  const result1 = await transform(fs.readFileSync(inputFile1, "utf8"), "client", inputFile1, true);
  test('Should recognize the file for client usage of "use client" directive', () => {
    return result1.meta.useClient;
  });

  const inputFile2 = path.join(__dirname, "src", "input2.tsx");
  const result2 = await transform(fs.readFileSync(inputFile2, "utf8"), "client", inputFile2, true);
  test('Should recognize the file for server usage because there is no "use client" directive', () => {
    return !result2.meta.useClient;
  });
};