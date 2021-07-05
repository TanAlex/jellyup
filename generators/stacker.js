const utils = require('../libs/utils');


const runwayGenerator = {
    description: 'Generate scaffold folders for a Stacker project, including runway.yml',
    prompts: [{
        type: 'input',
        name: 'name',
        message: 'Type the name of the project:'
    }, {
        type: 'input',
        name: 'customer',
        message: 'Type the customer name (one word, all lowercase):'
    }, {
        type: 'input',
        name: 'region',
        message: 'Type the AWS region where you want to deploy:'
    }, {
        type: 'input',
        name: 'accounts',
        message: 'Type a comma-separated list of accounts in the following format:\n environment:account-id:role-arn\n'
    }],
    actions: function(data){
        let actions = [];
        utils.formatInputData(data);
        actions.push({
            type: 'add',
            path: 'runway/runway.yml',
            data: data,
            templateFile: 'templates/stacker/scaffold-runway/runway/runway.yml.hbs'
        });

        // Create ${accounts}-${regions}.env in 00-account-setup folder
        for(let i=0; i<data.accounts.length; i++) {
            data.accounts[i].customer = data.customer;
            data.accounts[i].region = data.region;
            actions.push({
                type: 'add',
                path: `runway/00-account-setup/${data.accounts[i].env}-${data.region}.env`,
                data: data.accounts[i],
                templateFile: 'templates/stacker/scaffold-runway/runway/00-account-setup/accounts.env.hbs'
            });
        }

        // Create folder and env file for other modules.
        for(let i=0; i<data.accounts.length; i++) {
            actions.push({
                type: 'add',
                path: `runway/${data.accounts[i].env}/${data.accounts[i].env}-${data.region}.env`,
                data: data.accounts[i],
                templateFile: 'templates/stacker/scaffold-runway/runway/00-account-setup/accounts.env.hbs'
            });
        }

        // Create additional files that are needed.
        let files = ["Makefile", ".gitignore", "Pipfile", "README.md"]
        for (let file of files){
            actions.push({
                type: 'add',
                path: `runway/${file}`,
                data: data,
                templateFile: `templates/stacker/scaffold-runway/${file}.hbs`
            });
        } 

        return actions;
    }
};


module.exports = {
    runwayGenerator
}