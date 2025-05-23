const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
var data= {};
var appSetting = {};
var config = {
    fileExists: function(configFileName = ".jellyup/config.yaml"){
        const destDir = appSetting.destDir == undefined ? "." : appSetting.destDir;
        let configFile = configFileName;
        if (!configFileName.startsWith("/")) {
           configFile = path.join(destDir, configFileName);
        }
        try {
            if (fs.existsSync(configFile)) {
                return true;
            }
        } catch(err) {
            
        }
        return false;
    },
    loadConfigContent: function(fileContent){
        try {
            config.data = Object.assign({}, yaml.load(fileContent));
            config.configFileContent = fileContent;
            config.configFileLoaded = true;
        } catch(err) {
            console.error(err);
        }
    },
    loadConfig: function(configFileName = ".jellyup/config.yaml"){
        const destDir = appSetting.destDir == undefined ? "." : appSetting.destDir;
        let configFile = configFileName;
        if (!configFileName.startsWith("/")) {
           configFile = path.join(destDir, configFileName);
        }
        try {
            if (fs.existsSync(configFile)) {
                let fileContents = fs.readFileSync(configFile, 'utf8');
                config.data = Object.assign({}, config.data, yaml.load(fileContents));
                config.configFileContent = fileContents;
                config.configFileLoaded = true;
            }
        } catch(err) {
            console.error(err);
        }
    },
    loadConfigDir: function(configDir = ".jellyup"){
        const destDir = appSetting.destDir == undefined ? "." : appSetting.destDir;
        let configFile = configFileName;
        if (!configFileName.startsWith("/")) {
           configFile = path.join(destDir, configFileName);
        }
        let walk = function(dir) {
            var results = [];
            var list = fs.readdirSync(dir);
            if (list.length == 0) {
                return false;
            }
            for (let i = 0; i < list.length; i++) {
                let file = list[i];
                let file_path = path.join(dir, file);
                var stat = fs.statSync(file_path);
                if (stat && stat.isDirectory()) {
                    /* Recurse into a subdirectory */
                    walk(file_path);
                } else {
                    let fileContents = fs.readFileSync(file_path, 'utf8');
                    config.data = Object.assign({}, config.data, yaml.load(fileContents));
                    config.configFileLoaded = true;
                }
            }
        }
        walk(configDirPath);
    },
    data: data,
    appSetting: appSetting,
    debug: false,
    configFileLoaded: false
}

module.exports = config;
