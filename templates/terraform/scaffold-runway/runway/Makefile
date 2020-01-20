SHELL = /bin/bash
install:
	pipenv sync

test: install
	pipenv run runway test


deploy:  deploy-prod deploy-stage deploy-shared deploy-audit deploy-log-archive deploy-master

deploy-prod: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT=prod pipenv run runway deploy && \
        popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

deploy-stage: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT=stage pipenv run runway deploy && \
        popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

deploy-shared: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT=shared pipenv run runway deploy && \
        popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

deploy-audit: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT=audit pipenv run runway deploy && \
        popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

deploy-log-archive: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT=log-archive pipenv run runway deploy && \
        popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

deploy-master: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT=master pipenv run runway deploy && \
        popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

plan:  clean plan-prod plan-stage plan-shared plan-audit plan-log-archive plan-master

plan-prod: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT=prod pipenv run runway plan && \
        popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

plan-stage: clean
	@pushd ./runway && \
	    DEPLOY_ENVIRONMENT=stage pipenv run runway plan && \
	    popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

plan-shared: clean
	@pushd ./runway && \
	    DEPLOY_ENVIRONMENT=shared pipenv run runway plan && \
	    popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

plan-audit: clean
	@pushd ./runway && \
	    DEPLOY_ENVIRONMENT=audit pipenv run runway plan && \
	    popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

plan-log-archive: clean
	@pushd ./runway && \
	    DEPLOY_ENVIRONMENT=log-archive pipenv run runway plan && \
	    popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete

plan-master: clean
	@pushd ./runway && \
        DEPLOY_ENVIRONMENT=master pipenv run runway plan && \
        popd && \
        find . -name terraform.tfstate -type f -delete && \
        find . -name environment -type f -delete
