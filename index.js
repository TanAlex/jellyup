#!/usr/bin/env node
const path = require("path");
const nodePlop = require("node-plop");
const config = require("./libs/config");
const currentPath = process.cwd();
config.appSetting.currentPath = currentPath;
const configFileName = path.join(currentPath, "config.yaml");

console.log("🦄 Jellyup  🐠");

if(config.fileExists(configFileName)){
  config.loadConfig(configFileName);
  // console.debug(config);
}

var spawn = require("child_process").spawn;




// var plop = path.join(__dirname, "node_modules/plop/bin/plop.js");
// var test = spawn(
//   plop,
//   ["--dest", ".", "--plopfile", plopfile, "--cwd", __dirname],
//   { stdio: "inherit" }
// );
var plopfile = path.join(__dirname, "plopfile.js");
console.debug(`plopfile: ${plopfile}`);

const args = process.argv.slice(2);

const argv = require('minimist')(args);

const cwd = argv.cwd || __dirname;
const configPath = plopfile;
if ( argv.dest === undefined ){
  // Append process.argv
  console.log("set output dest to: "+ currentPath);
  process.argv.push("--dest");
  process.argv.push(currentPath);
}

const plop_path = path.join(__dirname, "node_modules/plop/src/plop.js");
const {Plop, run} = require(plop_path);
Plop.launch({
  cwd,
	configPath,
	require: argv.require,
	completion: argv.completion
}, run);