let fs = require("fs");
const path = require("node:path");

__dirname = path.join(".", "/01-read-file", "text.txt");

const stream = new fs.createReadStream(__dirname, { encoding: "utf-8" });

stream.on("readable", function () {
  const data = stream.read();
  if (data) {
    console.log(data);
  }
});

// stream.on("end", function () {});

stream.on("error", function (err) {
  if (err.code == "ENOENT") {
    console.log("Файл не найден");
  } else {
    console.error(err);
  }
});
