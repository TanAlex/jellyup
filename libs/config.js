const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
var data= {};
var appSetting = {};
var config = {
    fileExists: function(configFileName = ".jellyup/config.yaml"){
        try {
            if (fs.existsSync(configFileName)) {
                return true;
            }
        } catch(err) {
            
        }
        return false;
    },
    loadConfig: function(configFileName = ".jellyup/config.yaml"){
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
                    config.data = Object.assign({}, config.data, yaml.safeLoad(fileContents));
                    config.configFileLoaded = true;
                }
            }
        }
        walk(path.dirname(configFileName));
    },
    data: data,
    appSetting: appSetting,
    debug: false,
    configFileLoaded: false
}

module.exports = config;