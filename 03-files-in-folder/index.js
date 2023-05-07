import path from "node:path";

import { readdir } from "node:fs/promises";
import fs from "node:fs/promises";

const dirname = path.join(".", "/03-files-in-folder");

try {
  const files = await readdir(path.join(dirname, "secret-folder"), {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isFile()) {
      const fileInfo = await fs.stat(
        path.join(dirname, "secret-folder", file.name)
      );

      console.log(
        path.basename(file.name, path.extname(file.name)),
        "-",
        path.extname(file.name).slice(1),
        "-",
        `${fileInfo.size / 1000}kb`
      );
    }
  }
} catch (err) {
  console.error(err);
}
