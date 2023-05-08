import { copyFile } from "node:fs/promises";
import path from "node:path";
import { mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import * as fs from "fs";
import { pipeline } from "node:stream/promises";

const dirname = path.join(".", "/06-build-page");

//Блок - создание стилей--------------------------------------------------------

await mkdir(path.join(dirname, "/project-dist"), { recursive: true }, (err) => {
  if (err) throw err;
});

try {
  const files = await readdir(path.join(dirname, "styles"), {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === ".css") {
      await pipeline(
        fs.createReadStream(path.join(dirname, "styles", file.name), {
          encoding: "utf-8",
        }),
        fs.createWriteStream(path.join(dirname, "/project-dist", "style.css"))
      );
    }
  }
} catch (err) {
  console.error(err);
}
//----------------------------------------------------------------------

//Блок - копирование assets --------------------------------------------

await rm(
  path.join(dirname, "/project-dist", "/assets"),
  {
    recursive: true,
    force: true,
  },
  async () => {
    await mkdir(
      path.join(dirname, "/project-dist", "/assets"),
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );
  }
);

const copyFolder = async (folder) => {
  try {
    const folders = await readdir(path.join(dirname, folder), {
      withFileTypes: true,
    });
    for (const fold of folders) {
      if (fold.isFile()) {
        try {
          await copyFile(
            path.join(dirname, folder, fold.name),
            path.join(dirname, "/project-dist", folder, fold.name)
          );
        } catch {}
      } else {
        await mkdir(
          path.join(dirname, "/project-dist", folder, fold.name),
          { recursive: true },
          (err) => {
            if (err) throw err;
          }
        );

        copyFolder(`${folder}/${fold.name}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

copyFolder("/assets");

//Блок - создание index.html ---------------------------------------------

await copyFile(
  path.join(dirname, "template.html"),
  path.join(dirname, "/project-dist", "index.html")
);

let components = {};

try {
  const files = await readdir(path.join(dirname, "/components"), {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name).slice(1) === "html") {
      try {
        const contents = await readFile(
          path.join(dirname, "/components", file.name),
          { encoding: "utf8" }
        );

        components[path.basename(file.name, path.extname(file.name))] =
          contents;
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Это не файл");
    }
  }
} catch (err) {
  console.error(err);
}

const template = await readFile(path.join(dirname, "template.html"), {
  encoding: "utf8",
});

let newTemplate = template;

for (let key in components) {
  const reg = new RegExp(`\{\{[${key}]+?\}\}`, "g");
  newTemplate = newTemplate.replace(reg, components[key]);
}

await writeFile(
  path.join(dirname, "/project-dist", "index.html"),
  newTemplate,
  (err) => {
    if (err) console.log(err);
    else {
    }
  }
);
