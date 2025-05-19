
module.exports = function (plop, config) {
    const cfgDir = config.appSetting.cwd;
    plop.setGenerator('serverless:init', {
        description: 'generate config.yaml in current folder',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'project name please'
        }],
        actions: [{
            type: 'add',
            path:  '.jellyup/config.yaml',
            templateFile: `${cfgDir}/templates/serverless/config.yaml.hbs`
        }]
    });

    plop.setGenerator('serverless:scaffold-runway', {
        description: 'create scaffold folders including runway.yml',
        prompts: [],
        actions: function(data) {
            if(!config.configFileLoaded){
                console.log("ERROR: looks like you haven't run init to generate the config.yaml file");
                console.log("Please run init and modify the config.yaml first.");
                return false;
            }
            var actions = [];
            data = Object.assign({}, data, config.data);
            // console.log(config.data);
            // console.log(data);

            actions.push({
                type: 'add',
                path: 'runway.yml',
                data: data,
                templateFile: `${cfgDir}/templates/serverless/scaffold-runway/runway.yml.hbs`
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
                        path: `main.sls/config-${environment}-${region}.yml`,
                        data: d,
                        templateFile: `${cfgDir}/templates/serverless/scaffold-runway/main.sls/config-env.yml.hbs`
                    });
                }
            }
            let files = ["lambda_function.py", "package.json", "requirements.txt", "serverless.yml","serverless.wsgi.yml"]
            for (let file of files){
                let file_src = file + ".hbs";
                actions.push({
                    type: 'add',
                    path: `main.sls/${file}`,
                    data: data,
                    templateFile: `${cfgDir}/templates/serverless/scaffold-runway/main.sls/${file_src}`
                });
            } 
            files = ["Makefile", "gitignore", "Pipfile", "README.md"]
            for (let file of files){
                let file_dest = file;
                if (file == "gitignore"){
                    file_dest = `.${file}`;
                }
                actions.push({
                    type: 'add',
                    path: `${file_dest}`,
                    data: data,
                    templateFile: `${cfgDir}/templates/serverless/scaffold-runway/${file}`
                });
            }            

            return actions;
        }
    });

};