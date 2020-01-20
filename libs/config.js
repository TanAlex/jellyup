const fs = require('fs');
const yaml = require('js-yaml');
var data= {};
var appSetting = {};
var config = {
    fileExists: function(configFileName = "config.yaml"){
        try {
            if (fs.existsSync(configFileName)) {
                return true;
            }
        } catch(err) {
            
        }
        return false;
    },
    loadConfig: function(configFileName = "config.yaml"){
        let fileContents = fs.readFileSync(configFileName, 'utf8');
        config.data = yaml.safeLoad(fileContents);
    },
    data: data,
    appSetting: appSetting
}

module.exports = config;