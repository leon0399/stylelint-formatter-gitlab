# Stylelint Formatter for GitLab

[![pipeline status](https://gitlab.com/leon0399/stylelint-formatter-gitlab/badges/master/pipeline.svg)](https://gitlab.com/leon0399/stylelint-formatter-gitlab/-/commits/master)
[![coverage report](https://gitlab.com/leon0399/stylelint-formatter-gitlab/badges/master/coverage.svg)](https://gitlab.com/leon0399/stylelint-formatter-gitlab/-/commits/master)

> Show ESLint results directly in the [GitLab code quality] results

[gitlab code quality]: https://docs.gitlab.com/ee/user/project/merge_requests/code_quality.html

## Requirements

This requires at least GitLab Starter 11.5 and at least Stylelint 9.

## Installation

Install `eslint` and `eslint-formatter-gitlab` using your package manager.

```sh
npm install --save-dev stylelint stylelint-formatter-gitlab
```
```sh
yarn add --dev stylelint stylelint-formatter-gitlab
```

Define a GitLab job to run `stylelint`.

_.gitlab-ci.yml_:

```yaml
stylelint:
  image: node:10-alpine
  script:
    - npm ci
    - npx stylelint --custom-formatter=node_modules/stylelint-formatter-gitlab .
  artifacts:
    reports:
      codequality: gl-codequality.json
```

The formatter will automatically detect a GitLab CI environment. It will detect where to output the
code quality report based on the GitLab configuration file.

## Configuration Options

ESLint formatters don’t take any configuration options. In order to still allow some way of
configuration, options are passed using environment variables.

| Environment Variable         | Description                                                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `STYLELINT_CODE_QUALITY_REPORT` | The location to store the code quality report. By default it will detect the location of the codequality artifact defined in the GitLab CI configuration file. |
| `STYLELINT_FORMATTER`           | The Stylelint formatter to use for the console output. This defaults to string, the default Stylelint formatter.                                                    |

