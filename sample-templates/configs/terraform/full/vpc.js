
module.exports = function (plop, config) {
    const cfgDir = config.appSetting.cwd;
    function debug(){
        if(config.debug){
            console.log(...arguments);
        }
    }
    plop.setGenerator('terraform:vpc:init', {
        description: 'generate vpc.yaml in .jellyup folder',
        prompts: [],
        actions: [{
            type: 'add',
            path:  '.jellyup/vpc.yaml',
            templateFile: `${cfgDir}/templates/terraform/scaffold-runway/vpc/vpc.yaml.hbs`
        }]
    });
    plop.setGenerator('terraform:vpc:generate', {
        description: 'generate vpc terraform module code',
        prompts: [],
        actions: function(data) {
            if(!config.fileExists(".jellyup/vpc.yaml")){
                console.log("ERROR: looks like you haven't run init to generate the config.yaml file");
                console.log("Please run init and modify the config.yaml first.");
                return false;
            }
            config.loadConfigDir(".jellyup");
            var actions = [];
            let key = "vpc";
            data = Object.assign({}, data, config.data);
            debug("==> config.data:")
            debug(config.data);
            debug("==> data:")
            debug(data);

            let m_data = Object.assign({}, config.data[key]);
            debug("==> m_data:")
            debug(m_data);
            for (const [environment, account] of Object.entries(data.account_ids)){
                let env_keys = data[key].environments;
                let env_config = m_data;
                debug("1 env_keys:", env_keys);
                debug("type: ", typeof(data[key].environments));
                if (data[key].environments != null && typeof(data[key].environments) == "object"){
                    env_keys = Object.keys(data[key].environments);
                    env_config = data[key].environments[environment];
                }
                debug("2 env_keys:", env_keys);
                if (! env_keys.includes(environment)) { continue }
                
                if(typeof(env_config) == "object"){
                    m_data = Object.assign(m_data, env_config);
                }

                debug("env_config:", env_config);
                let regions = [];
                if(typeof env_config == "object" && env_config.regions !== undefined ){
                    regions = Object.keys(env_config.regions);
                }else if (data[key].regions !== undefined) {
                    regions = data[key].regions;
                }else if(regions.length == 0){
                    regions = config.data.regions;
                }
                debug("regions:", regions);
                for (let region of regions){
                    let d = Object.assign({}, data);
                    d.environment = environment;
                    d.account = account;
                    d.region = region;
                    if(typeof env_config == "object" && env_config.regions !== undefined ){
                        m_data = Object.assign(m_data, env_config.regions[region]);
                    }
                    d[key] = Object.assign({}, m_data);
                    debug(d);
                    plop.setHelper("render", function(varName) {
                        return plop.renderString(varName, d)
                    });
                    actions.push({
                        type: 'add',
                        path: `terraform/vpc/backend-${environment}-${region}.tfvars`,
                        data: d,
                        templateFile: `${cfgDir}/templates/terraform/scaffold-runway/vpc/backend.tfvars.hbs`
                    });
                    actions.push({
                        type: 'add',
                        path: `terraform/vpc/${environment}-${region}.tfvars`,
                        data: d,
                        templateFile: `${cfgDir}/templates/terraform/scaffold-runway/vpc/variables.tfvars.hbs`
                    });

                }
            }
            actions.push({
                type: 'addMany',
                destination: `terraform/vpc`,
                base: `${cfgDir}/templates/terraform/scaffold-runway/vpc`,
                templateFiles: [ `${cfgDir}/templates/terraform/scaffold-runway/vpc/**/*.tf.hbs` ],
                data: data,
            });
            return actions;
        }
    });
};