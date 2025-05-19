const path = require("path");
const config = require("./libs/config");
var defaultConfigPath = path.join(__dirname, "configs");
const fs = require("fs");

module.exports = function(plop) {
  let configPath = config.appSetting.configDir;
  // console.log(`configPath: ${configPath}`);
  fs.readdirSync(configPath).forEach(function(file) {
    file = path.join(configPath, file);
    // if (! file.startsWith("."))
      require(file)(plop, config);
  });
};
