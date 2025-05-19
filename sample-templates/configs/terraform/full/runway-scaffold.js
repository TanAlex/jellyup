
module.exports = function (plop, config) {
    const cfgDir = config.appSetting.cwd;
    plop.setGenerator('terraform:init', {
        description: 'generate config.yaml in current folder',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'project name please'
        }],
        actions: [{
            type: 'add',
            path:  '.jellyup/config.yaml',
            templateFile: `${cfgDir}/templates/terraform/config.yaml.hbs`
        }]
    });

    plop.setGenerator('terraform:scaffold-runway', {
        description: 'create scaffold folders including runway.yml',
        prompts: [],
        actions: function(data) {
        
            if(!config.fileExists()){
                console.log("ERROR: looks like you haven't run init to generate the config.yaml file");
                console.log("Please run init and modify the config.yaml first.");
                return false;
            }
            config.loadConfig(".jellyup/config.yaml");
            var actions = [];
            data = Object.assign({}, data, config.data);
            // console.log(config.data);
            // console.log(data);

            actions.push({
                type: 'add',
                path: 'runway/runway.yml',
                data: data,
                templateFile: `${cfgDir}/templates/terraform/scaffold-runway/runway/runway.yml.hbs`
            });

            // Create ${accounts}-${regions}.env in 00-account-setup folder
            for (const [environment, account] of Object.entries(data.account_ids)){
                for (let region of data.regions){
                    let d = Object.assign({}, data);
                    d.environment = environment;
                    d.account = account;
                    d.region = region;
                    actions.push({
                        type: 'add',
                        path: `runway/00-account-setup/${environment}-${region}.env`,
                        data: d,
                        templateFile: `${cfgDir}/templates/terraform/scaffold-runway/runway/00-account-setup/accounts.env.hbs`
                    });
                    actions.push({
                        type: 'add',
                        path: `runway/${environment}/${environment}-${region}.env`,
                        data: d,
                        templateFile: `${cfgDir}/templates/terraform/scaffold-runway/runway/00-account-setup/accounts.env.hbs`
                    });
                }
            }

            let files = ["Makefile", "gitignore", "Pipfile", "README.md"]
            for (let file of files){
                let file_dest = file;
                if (file == "gitignore"){
                    file_dest = `.${file}`;
                }
                actions.push({
                    type: 'add',
                    path: `${file_dest}`,
                    data: data,
                    templateFile: `${cfgDir}/templates/terraform/scaffold-runway/${file}`
                });
            }            

            return actions;
        }
    });

};
