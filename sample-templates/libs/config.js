const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
var data= {};
var appSetting = {};
var config = {
    fileExists: function(configFileName = ".jellyup/config.yaml"){
        const destDir = appSetting.destDir == undefined ? "." : appSetting.destDir;
        const configFile = path.join(destDir, configFileName);
        try {
            if (fs.existsSync(configFile)) {
                return true;
            }
        } catch(err) {
            
        }
        return false;
    },
    loadConfig: function(configDir = ".jellyup"){
        const destDir = appSetting.destDir == undefined ? "." : appSetting.destDir;
        const configDirPath = path.join(destDir, configDir);
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
