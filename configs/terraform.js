const config = require("../libs/config");

module.exports = function (plop) {
    plop.setGenerator('terraform:init', {
        description: 'generate config.yaml in current folder',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'project name please'
        }],
        actions: [{
            type: 'add',
            path:  'config.yaml',
            templateFile: "templates/terraform/config.yaml.hbs"
        }]
    });

    plop.setGenerator('terraform:scaffold-runway', {
        description: 'create scaffold folders including runway.yml',
        prompts: [],
        actions: function(data) {

            var actions = [];
            data = Object.assign({}, data, config.data);
            // console.log(config.data);
            // console.log(data);

            actions.push({
                type: 'add',
                path: 'runway/runway.yml',
                data: data,
                templateFile: 'templates/terraform/scaffold-runway/runway/runway.yml.hbs'
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
                        templateFile: 'templates/terraform/scaffold-runway/runway/00-account-setup/accounts.env.hbs'
                    });
                }
            }

            let files = ["Makefile", ".gitignore", "Pipfile", "README.md"]
            for (let file of files){
                actions.push({
                    type: 'add',
                    path: `runway/${file}`,
                    data: data,
                    templateFile: `templates/terraform/scaffold-runway/runway/${file}`
                });
            }            

            return actions;
        }
    });
};