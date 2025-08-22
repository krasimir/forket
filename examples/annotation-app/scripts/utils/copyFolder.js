import fs from 'fs';
import path from 'path';

export default function copyFolder(src, dest) {
  // Ensure destination folder exists
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolder(srcPath, destPath); // recurse into subfolder
    } else {
      fs.copyFileSync(srcPath, destPath); // copy file
    }
  }
}
