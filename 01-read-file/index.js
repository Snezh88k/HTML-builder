import * as fs from "fs";
import path from "node:path";

const dirname = path.join(".", "/01-read-file", "text.txt");

const stream = new fs.createReadStream(dirname, { encoding: "utf-8" });

stream.on("readable", function () {
  const data = stream.read();
  if (data) {
    console.log(data);
  }
});

stream.on("error", function (err) {
  if (err.code == "ENOENT") {
    console.log("Файл не найден");
  } else {
    console.error(err);
  }
});
