#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const {version} = require('./package.json');

var inquirer = require("inquirer");
const nodePlop = require("node-plop");
const config = require("./libs/config");
var defaultConfigPath = path.join(__dirname, "configs");
const currentPath = process.cwd();
config.appSetting.currentPath = currentPath;
config.appSetting.configDir = defaultConfigPath;


const { debug } = require("./libs/utils");

const chalk = require('chalk');
const c_orage = chalk.bold.keyword('orange');
const usage = function(){
  console.log(c_orage("Usage:"));
  console.log(chalk`
    A 🚀 scaffolding tool 🧨 to quickly generate any kind of IaC code.
    It's very easy to add your own templates, configs files to build your own modules.

    {yellow jellyup [-cwd "directory hold your custom configs & template"] [-v or -verbose] [-f or -force]}
    
    {cyan.bold Basic usage:}
      {green jellyup}
      > this is the simplest way to use it. It will use built-in config and templates
      {green jellyup} -v -f
      > this shows debug message and force overwrite exsiting files
      {green jellyup} -m "module name path"
      For example: 
      {green jellyup} -m terraform:full
      > this will start on terraform:full modules directly rather than answering questions to choose it
      {green jellyup} -c "path to you .jellyup config folder"
      For example: 
      {green jellyup} -c ..
      > this is to tell where to find the .jellyup folder, by default it looks in current folder (.)
    {cyan.bold Advanced usage:}
      {cyan jellyup} {green -cwd my-folder-contains-configs-and-templates}
      for example:
      {cyan jellyup} {green -cwd ./my-jellyup-module-folder}
      > This will use your own folder that contains your own configs and templates
      {cyan jellyup} {green -cwd ./my-jellyup-module-folder -dest ./my-output-folder }
      > This will generate the output files to ./my-output-folder, 
        by default the output folder is .
    {cyan.bold Kitchen-sink usage:}
      {cyan jellyup} -m terraform:full \
          -cwd my-folder-contains-configs-and-templates \
          -dest ./my-output-folder \
          -c $HOME \
          -v -f
`);
}

console.log("🦄  Jellyup  🐠");
console.log(`version: ${version}`);

const args = process.argv.slice(2);

const argv = require("minimist")(args);


let configFileName = path.join(currentPath,".jellyup", "config.yaml");

if (argv.c != undefined){
  configFileName = path.join(path.resolve(argv.c), ".jellyup","config.yaml");
}

if (config.fileExists(configFileName)) {
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


if (argv.h != undefined || argv.help != undefined){
  usage();
  process.exit(0);
}

if (argv.v != undefined || argv.verbose != undefined) {
  config.debug = true;
}

var plopfile = path.join(__dirname, "plopfile.js");
debug(`plopfile: ${plopfile}`);
debug(`configFileName: ${configFileName}`);

const configPath = plopfile;

let configDir = defaultConfigPath;
const cwd = argv.cwd || __dirname;
if (argv.cwd != undefined) {
  cwd = argv.cwd;
  configDir = path.join(cwd, "configs");
}
if (argv.configDir != undefined) {
  configDir = argv.configDir;
}


let module_str = ( argv.m != undefined) ? argv.m: (argv.module != undefined)? argv.module: "" ;
debug(`module_str: ${module_str}`);
let modules = module_str.split(/[:\/\\\|]/);
moduleDir = path.join(configDir, ...modules );

configDir = moduleDir;
if (! fs.existsSync(configDir)){
  console.log(chalk`
{red [ERROR]} the path {yellow ${moduleDir}} doesn't exist
  `);
  process.exit(1);
}

let walk = async function(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  if (list.length == 0) {
    return false;
  }
  for (let i = 0; i < list.length; i++) {
    let file = list[i];

    var stat = fs.statSync(path.join(dir, file));
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results.push(file);
    } else {
      /* Is a file */
      config.appSetting.configDir = dir;
      return true;
    }
  }
  answers = await inquirer.prompt([
    {
      type: "list",
      name: "subdir",
      message: "What sub-module to select?",
      choices: results
      // filter: function(val) {
      //   return val.toLowerCase();
      // }
    }
  ]);

  // console.log(JSON.stringify(answers, null, '  '));
  let subdir = path.join(dir, answers.subdir);
  return await walk(subdir);
};

walk(configDir).then(res => {
  if (!res) {
    console.log("No config files found, please check your configs folder.");
  } else {
    process.argv = process.argv.slice(0, 2);
    if (argv.dest === undefined) {
      // Append process.argv
      debug("set output dest to: " + currentPath);
      process.argv.push("--dest");
      process.argv.push(currentPath);
    }
    if (argv.force != undefined || argv.f != undefined) {
      process.argv.push("-f");
    }
    const plop_path = path.join(__dirname, "node_modules/plop/src/plop.js");
    const { Plop, run } = require(plop_path);
    debug(`cwd: ${cwd}`);
    debug(`configPath: ${configPath}`);
    debug(`argv: ${process.argv}`);
    Plop.launch(
      {
        cwd,
        configPath,
        require: argv.require,
        completion: argv.completion
      },
      run
    );
  }
});

