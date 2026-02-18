import fs from "fs";
import crypto from "crypto";

const idGenerate = crypto.randomBytes(6).toString("hex");
const readPackage = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

console.log(`dev-${idGenerate}-${readPackage.version}`);
