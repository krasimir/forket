import path from 'path';
import fs from 'fs';

export default function serverActionsHandler(manifestLocation, MANIFEST_FILE_NAME) {
  if (!manifestLocation) {
    throw new Error(
      `‎𐂐 Forket: missing "manifestLocation" parameter. Please provide the location of server's root directory where the manifest is generated. Look around for ${MANIFEST_FILE_NAME} file.`
    );
  }
  let serverActions = [];
  const file = path.join(manifestLocation, MANIFEST_FILE_NAME);
  try {
    const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
    if (manifest.serverActions) {
      serverActions = manifest.serverActions;
    } else {
      console.warn(`‎𐂐 Forket: server actions not found in the manifest at ${file}`);
    }
  } catch (err) {
    console.error(`‎𐂐 Forket: error reading or parsing manifest at ${file}:`, err);
    return (req, res) => {
      res.status(500);
      res.json({
        error: `Error reading or parsing Forket manifest`
      });
    };
  }
  return (req, res) => {
    serverActions;
    res.json({
      ok: true
    });
  };
}