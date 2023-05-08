import path from "node:path";

import { readdir } from "node:fs/promises";

import * as fs from "fs";

const dirname = path.join(".", "/05-merge-styles");
let streamWrite = fs.createWriteStream(
  path.join(dirname, "/project-dist", "bundle.css")
);

try {
  const files = await readdir(path.join(dirname, "styles"), {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === ".css") {
      let streamRead = fs.createReadStream(
        path.join(dirname, "styles", file.name),
        { encoding: "utf-8" }
      );

      streamRead.pipe(streamWrite);
    }
  }
} catch (err) {
  console.error(err);
}
