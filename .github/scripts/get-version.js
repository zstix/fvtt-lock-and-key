const fs = require("fs");
const path = require("path");

const filepath = path.join(process.cwd(), "/src/module.json");
const data = JSON.parse(fs.readFileSync(filepath, "utf8"));

// Output the version to be used in later steps
console.log(`::set-output name=version::${data.version}`);
