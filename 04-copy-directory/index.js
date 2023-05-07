import { copyFile } from "node:fs/promises";
import path from "node:path";
import { mkdir, rmdir, unlink } from "node:fs";
import { readdir } from "node:fs/promises";

const dirname = path.join(".", "/04-copy-directory");

try {
  const files = await readdir(path.join(dirname, "files-copy"), {
    withFileTypes: true,
  });
  if (files) {
    for (const file of files) {
      if (file.isFile()) {
        unlink(path.join(dirname, "/files-copy", file.name), (err) => {
          if (err) throw err;
        });
      }
    }
  } else {
    null;
  }
} catch (err) {}

mkdir(path.join(dirname, "/files-copy"), { recursive: true }, (err) => {
  if (err) throw err;
});

try {
  const files = await readdir(path.join(dirname, "files"), {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isFile()) {
      try {
        await copyFile(
          path.join(dirname, "/files", file.name),
          path.join(dirname, "/files-copy", file.name)
        );
        console.log("Successful copy");
      } catch {
        console.error("The file could not be copied");
      }
    }
  }
} catch (err) {
  console.error(err);
}
