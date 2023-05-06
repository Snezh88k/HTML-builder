import path from "node:path";
import * as fs from "fs";
import * as readline from "node:readline/promises";
import process from "node:process";

const dirname = path.join(".", "/02-write-file", "text.txt");

const streamWrite = new fs.createWriteStream(dirname, { encoding: "utf-8" });
const streamRead = new fs.createReadStream(dirname, { encoding: "utf-8" });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Привет");
const readFile = async () => {
  const answer = await rl.question("Введите ваше сообщение ");

  if (answer && answer !== "exit") {
    streamWrite.write(answer);
    readFile();
  } else {
    rl.close();
  }
};

readFile();

process.on("beforeExit", () => {
  streamRead.on("data", function (chunk) {
    console.log("\nПока, май фрэнд! Содержимое файла: ", chunk);
  });
});
