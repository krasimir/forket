import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientReplacerCode = fs.readFileSync(path.join(__dirname, "..", "client", "client.min.js")).toString("utf8");

export default function client(serverActionsEndpoint, options = { enableLogging: true }) {
  let str = clientReplacerCode;
  str = str.replace(/__FORKET_SERVER_ACTIONS_ENDPOINT__/g, serverActionsEndpoint);
  str = str.replace(/__ENABLE_LOGGIGN__/g, options?.enableLogging ? "1" : "0");
  return str;
}
