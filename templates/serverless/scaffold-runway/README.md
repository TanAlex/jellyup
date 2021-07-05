# README

AWS infrastructure as code.

## Usage

This directory uses a python virtual environment (`pipenv`). To activate the virtual environment, run `make install` to first prepare the environment by installing all packages then, use `pipenv shell` to enter the virtual environment.

> If using `make` commands, you do not need to enter the virtual environment with `pipenv shell`. This is handled by the command itself.

### Make Commands

`make` is used to simplify actions in this directory. To see a complete list of commands, review [Makefile](./Makefile).

## /runway

This directory contains [runway](https://github.com/onicagroup/runway) deployments. Runway is used to wrap deployments to simplify deployments across multiple regions/accounts.

## /terraform

This directory contains Terraform modules. Modules should generally define application level resources.
