import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function ({ test, toAST, toCode }) {
  
  await test("Should properly deal with server actions", async () => {
    const cases = ["a"];
    for (let i = 0; i < cases.length; i++) {
      
    }
    return true;
  });
};