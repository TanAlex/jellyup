#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const {version} = require('./package.json');

var inquirer = require("inquirer");
const nodePlop = require("node-plop");
const config = require("./libs/config");
var defaultConfigPath = "configs";
const currentPath = process.cwd();
config.appSetting.currentPath = currentPath;
config.appSetting.configDir = defaultConfigPath;


const { debug, manage_cwd } = require("./libs/utils");

const chalk = require('chalk');
const c_orage = chalk.bold.keyword('orange');
const usage = function(){
  console.log(c_orage("Usage:"));
  console.log(chalk`
    A 🚀 scaffolding tool 🧨 to quickly generate any kind of IaC code.
    It's very easy to add your own templates, configs files to build your own modules.

    {yellow jellyup [--cwd "directory hold your custom configs & template"] [-v or --verbose] [-f or --force]}
    
    {cyan.bold Basic usage:}
      {green jellyup}
      > this is the simplest way to use it. It will use built-in config and templates
      {green jellyup} -v -f
      > this shows debug message and force overwrite exsiting files
      {green jellyup} -m "module name path"
      For example: 
      {green jellyup} -m terraform:full
      > this will start on terraform:full modules directly rather than answering questions to choose it
    {cyan.bold Advanced usage:}
      {cyan jellyup} {green --cwd my-folder-contains-configs-and-templates}
      for example:
      {cyan jellyup} {green --cwd ./my-jellyup-module-folder}
      > This will use your own folder that contains your own configs and templates
      {cyan jellyup} {green --cwd ./my-jellyup-module-folder --dest ./my-output-folder }
      > This will generate the output files to ./my-output-folder, 
        by default the output folder is .
    {cyan.bold Usage Examples:}
      {cyan jellyup} -m terraform:full \
          --cwd my-folder-contains-configs-and-templates \
          --dest ./my-output-folder \
          -v -f
      {cyan jellyup} -m terraform:full \
          --cwd "git@github-tan:TanAlex/jellyup/sample-templates?ref=v0.5.1" \
          --dest /tmp/test \
          -v -f
      {cyan jellyup} -m serverless:full \
          --cwd "https://github.com/TanAlex/jellyup/sample-templates?ref=master" \
          --dest /tmp/test \
          -v -f
`);
}

console.log("🦄  Jellyup  🐠");
console.log(`version: ${version}`);
console.log(chalk`{green.bold Welcome to Jellyup!}`);
console.log(chalk`{cyan This is a scaffolding tool to quickly generate any kind of code.}`);
console.log(chalk`{cyan It's very easy to create your own templates, configs files for your own modules.}`);


const args = process.argv.slice(2);

const argv = require("minimist")(args);

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

const configPath = plopfile;

// Define configDir variable at the top level for the walk function to use
let configDir;

// Main async function to handle the application flow
async function main() {
  configDir = defaultConfigPath;
  let cwd = argv.cwd;
  debug(`cwd: ${cwd}`);
  if (argv.cwd != undefined) {
    cwd = argv.cwd;
  } else {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "configDir",
        message: "Pls provide the path which contains the configs and templates\n " +
                 "you can use local path or github url like these \n" +
                 "  - ./my-path/my-sub-path \n" +
                 "  - https://github.com/my-org/my-repo/my-path/my-sub-path?ref=v1.0.0 \n" + 
                 "  - git@github.com:my-org/my-repo/my-path/my-subpath?ref=0.0.8 \n" +
                 "Please input the path: ",
        default: cwd,
        // validate: function(input) {
        //   if (fs.existsSync(input)) {
        //     return true;
        //   }
        //   return 'Directory does not exist. Please enter a valid path.';
        // }
      }
    ]);
    cwd = answer.configDir;
  }
  
  // Process the cwd input using the new manage_cwd function
  const processedCwd = manage_cwd(cwd);
  
  // If processedCwd is undefined, it means there was an error in processing
  if (processedCwd === undefined) {
    console.log(chalk`{red [ERROR]} Failed to process the provided path`);
    process.exit(1);
  }
  
  cwd = processedCwd;
  config.appSetting.cwd = cwd;

  configDir = path.join(cwd, "configs");
  if (argv.configDir != undefined) {
    configDir = argv.configDir;
  }

  let module_str = ( argv.m != undefined) ? argv.m: (argv.module != undefined)? argv.module: "" ;
  debug(`module_str: ${module_str}`);
  let modules = module_str.split(/[:\/\\\|]/);
  let moduleDir = path.join(configDir, ...modules );

  configDir = moduleDir;
  if (! fs.existsSync(configDir)){
    console.log(chalk`
{red [ERROR]} the path {yellow ${moduleDir}} doesn't exist
    `);
    process.exit(1);
  }

  process.argv = process.argv.slice(0, 2);
  let destDir = argv.dest;
  if (argv.dest === undefined) {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "destDir",
        message: "Please provide the folder that will hold generated files: ",
        default: currentPath,
        validate: function(input) {
          if (fs.existsSync(input)) {
            return true;
          }
          return 'Directory does not exist. Please enter a valid path.';
        }
      }
    ]);
    destDir = path.resolve(answer.destDir);

  }else{
    destDir = path.resolve(argv.dest);
  }
    // Append to process.argv
  debug("set output dest to: " + destDir);
  process.argv.push("--dest");
  process.argv.push(destDir);
  config.appSetting.destDir = destDir;

  if (argv.force != undefined || argv.f != undefined) {
    process.argv.push("-f");
  }


    debug(`configDir: ${configDir}`);
    const result = await walk(configDir);
    if (!result) {
      console.log("See you next time!");
      process.exit(0);
    } else {

    // const plop_path = path.join(__dirname, "node_modules/plop/src/plop.js");
    // const { Plop, run } = require(plop_path);
    const { Plop, run } = require("plop");
    debug(`cwd: ${cwd}`);
    debug(`configPath: ${configPath}`);
    debug(`argv: ${process.argv}`);
    // Plop.launch(
    //   {
    //     cwd,
    //     configPath,
    //     require: argv.require,
    //     completion: argv.completion
    //   },
    //   run
    // );
    await Plop.prepare({
      cwd,
      configPath,
      preload: argv.require || [],
      completion: argv.completion
    }, env => Plop.execute(env, run));
  }

}

let walk = async function(dir) {
  let results = [];
  let list = fs.readdirSync(dir);
  if (list.length == 0) {
    return false;
  }
  for (let i = 0; i < list.length; i++) {
    let file = list[i];

    let stat = fs.statSync(path.join(dir, file));
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results.push(file);
    } else {
      /* Is a file */
      config.appSetting.configDir = path.resolve(dir);
      return true;
    }
  }
  results.push("<exit>");
  let answers = await inquirer.prompt([
    {
      type: "list",
      name: "subdir",
      message: "Choose one option: ",
      choices: results
      // filter: function(val) {
      //   return val.toLowerCase();
      // }
    }
  ]);
  if (answers.subdir == "<exit>") {
    return false;
  }
  // console.log(JSON.stringify(answers, null, '  '));
  let subdir = path.join(dir, answers.subdir);
  return await walk(subdir);
};

// Start the application
main().catch(err => {
  console.error('An error occurred:', err);
  process.exit(1);
});
