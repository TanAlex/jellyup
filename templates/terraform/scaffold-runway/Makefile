SHELL = /bin/bash
install:
	pipenv sync

test: install
	pipenv run runway test


deploy:  {{#each account_ids}}deploy-{{@key}} {{/each}}

{{#each account_ids}}
deploy-{{@key}}: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT={{@key}} pipenv run runway deploy && \
        popd

{{/each}}

plan:  clean {{#each account_ids}}plan-{{@key}} {{/each}}

{{#each account_ids}}
plan-{{@key}}: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT={{@key}} pipenv run runway plan && \
        popd
        
{{/each}}