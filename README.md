# cvs-svc-test-station

## Introduction

The test-station microservice contains some reference data to be used for CVS services and mobile application for DVSA.

## Dependencies

The project runs on node >10.x with typescript and serverless framework. For further details about project dependencies, please refer to the `package.json` file.
[nvm](https://github.com/nvm-sh/nvm/blob/master/README.md) is used to managed node versions and configuration explicitly done per project using an `.npmrc` file.

### Prerequisites

Please install and run the following securiy programs as part of your development process:

- [git-secrets](https://github.com/awslabs/git-secrets)
  After installing, do a one-time set up with `git secrets --register-aws`. Run with `git secrets --scan`.

- [repo-security-scanner](https://github.com/UKHomeOffice/repo-security-scanner)

These will be run as part of your projects hooks so you don't accidentally introduce any new security vulnerabilities.

## Architecture

Data is used is made available to VTA for searching a vehicle.
Please refer to the the [docs](./docs/README.md) for the API specification and samples of postman requests.

### End to end design

[All in one view](https://wiki.dvsacloud.uk/pages/viewpage.action?pageId=79254695)

### Defect microservice

More information about technical designs can be found under the [Test Stations Microservice](https://wiki.dvsacloud.uk/display/HVT/Test+Station+Microservice) section.

## Getting started

Set up your nodejs environment running `nvm use` and once the dependencies are installed using `npm i`, you can run the scripts from `package.json` to build your project.
This code repository uses [serverless framework](https://www.serverless.com/framework/docs/) to mock AWS capabilities for local development.
You will also require to install dynamodb serverless to run your project with by running the following command `npm run tools-setup` in your preferred shell.
Please refer to the local development section to [configure your project locally](#developing-locally).

The project has multiple hooks configured using [husky](https://github.com/typicode/husky#readme) which will execute the following scripts: `security-checks`, `audit`, `tslint`, `prepush`.  
The latest version of husky has changed in two important ways.

- Hooks are no longer specified in package.json, but are in the .husky folder. They still point back to the npm scripts in package.json. Details of why can be seen on [github](https://blog.typicode.com/husky-git-hooks-javascript-config/).
- Hooks are not automatically installed via `npm install` any more. The installation of the hooks has been added to the `npm run tools-setup` script. Details of why can be seen on [github](https://blog.typicode.com/husky-git-hooks-autoinstall/).

**_It is very important that husky is installed, otherwise none of the security and code standard checks will run prior to commiting or pushing to github._**

SonarQube code coverage analysis has been added as part of the git prepush hook. This is to better align with what happens in the pipeline.  
To get it working locally, follow these steps:

- Ensure husky hooks are installed by running `npm i && npm run tools-setup`.
- Ensure SonarQube is installed. Running in a [container](https://hub.docker.com/_/sonarqube) is a great option.
- Within SonarQube, Disable Force user authentication via Administration -> Configuration -> Security.
- Install jq with `sudo apt install jq` or `brew install jq`.

When running `git push`, it will run tests followed by the sonarqube scan. If the scan fails or the unit test coverage is below 80%, the push is cancelled.

### Environmental variables

- The `BRANCH` environment variable indicates in which environment is this application running. Use `BRANCH=local` for local development. This variable is required when starting the application or running tests.

### Scripts

The following scripts are available, however you can refer to the `package.json` to see the details:

- installing dependencies: `npm install`
- local development by starting the service: `npm start`
- building the project: `npm run build`
- unit tests: `npm t`
- integration tests: `npm run test-i`

### DynamoDB and seeding

You won't need to change the configuration.
However, if you want the database to be populated with mock data on start, in your `serverless.yml` file, you need to set `seed` to `true`. You can find this setting under `custom > dynamodb > start`.

If you choose to run the DynamoDB instance separately, you can send the seed command with the following command:

`sls dynamodb seed --seed=test-stations`

Under `custom > dynamodb > seed` you can define new seed operations with the following config:

```yml
custom:
  dynamodb:
    seed:
      [SEED NAME HERE]:
        sources:
          - table: [TABLE TO SEED]
            sources: [./path/to/resource.json]
```

### Developing locally

Default DynamoDB configuration for seeding the data:

```yml
migrate: true
seed: true
noStart: false
```

### Debugging

The following environmental variables can be given to your serverless scripts to trace and debug your service:

```shell
AWS_XRAY_CONTEXT_MISSING = LOG_ERROR
SLS_DEBUG = *
BRANCH = local
```

*GET* operations are exposed to the VTA App via API Gateway.

**In AWS:**  
https://api.gateway.uri/develop/test-stations/P12345

**Locally:**  
http://localhost:3004/test-stations/P12345

*UPSERT* operations are via direct lambda invocation with an EventBridgeEvent object.
```
{
  "version":"0",
  "id":"3b8d813d-9e1c-0c30-72f9-7539de987e31",
  "detail-type":"CVS Update Test Stations",
  "source":"cvs.update.test.stations",
  "account":"1234567890",
  "time":"2022-01-26T12:18:26Z",
  "region":"eu-west-1",
  "resources":[],
  "detail":{
    "testStationId": "fb342fef-725e-ec11-8f8f-002248437f2d",
    "testStationAccessNotes": null,
    "testStationAddress": "Test Street 1, null",
    "testStationContactNumber": "0115 0115115,
    "testStationEmails": [ "test@test.com" ],
    "testStationGeneralNotes": "Some words.",
    "testStationLongitude": -1.5882060527801514,
    "testStationLatitude": 55.01923751831055,
    "testStationName": "Test ATF",
    "testStationPNumber": "P12345",
    "testStationPostcode": "NE12 3AB",
    "testStationStatus": "active",
    "testStationTown": "Testtown",
    "testStationType": "atf"
  }
}
```

**In AWS:**  
Either via direct lambda invocation via the AWS CLI or the Lambda Test Event feature in the AWS Console.

**Locally:**  
Upsert operations can be achieved locally via a POST to http://localhost:3004/{apiVersion}/functions/cvs-svc-test-station-dev-getTestStations/invocations.

The test station will either be inserted or updated based on the absence or presense of a test station with the same testStationPNumber.

## Testing

Jest is used for unit testing.
Please refer to the [Jest documentation](https://jestjs.io/docs/en/getting-started) for further details.

### Unit test

In order to test, you need to run the following:

```sh
npm run test # unit tests
```

### Integration test

In order to test, you need to run the following, with the service running locally:

```sh
npm run test-i # for integration tests
```

### End to end

- [Automation test repository](https://github.com/dvsa/cvs-auto-svc)
- [Java](https://docs.oracle.com/en/java/javase/11/)
- [Serenity Cucumber with Junit](https://serenity-bdd.github.io/theserenitybook/latest/junit-basic.html)

## Infrastructure

We follow a [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) approach for development.
For the CI/CD and automation please refer to the following pages for further details:

- [Development process](https://wiki.dvsacloud.uk/display/HVT/CVS+Pipeline+Infrastructure)
- [Pipeline](https://wiki.dvsacloud.uk/pages/viewpage.action?pageId=36870584)

## Contributing

Please familiarise yourself with [commitlint](https://commitlint.js.org/#/) and [conventional commits conventions](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) as a hook is in place to enforce standards.

The project follow the a Kanban [delivery workflow](https://wiki.dvsacloud.uk/display/HVT/Project+Roadmap+and+Delivery+Workflow?preview=/42796907/72550114/CVS%20Delivery%20Workflow%20V0.10.pdf#ProjectRoadmapandDeliveryWorkflow-CVSDeliveryWorkflow).

### Code standards

The codebase uses [typescript clean code standards](https://github.com/labs42io/clean-code-typescript) as well as sonarqube for static analysis.

SonarQube is available locally, please follow the instructions below if you wish to run the service locally (brew is the preferred approach).

### Static code analysis

_Brew_ (recommended):

- Install sonarqube using brew
- Change `sonar.host.url` to point to localhost, by default, sonar runs on `http://localhost:9000`
- run the sonar server `sonar start`, then perform your analysis `npm run sonar-scanner`

_Manual_:

- [Download sonarqube](https://www.sonarqube.org/downloads/)
- Add sonar-scanner in environment variables in your profile file add the line: `export PATH=<PATH_TO_SONAR_SCANNER>/sonar-scanner-3.3.0.1492-macosx/bin:$PATH`
- Start the SonarQube server: `cd <PATH_TO_SONARQUBE_SERVER>/bin/macosx-universal-64 ./sonar.sh start`
- In the microservice folder run the command: `npm run sonar-scanner`
