# cvs-svc-stub-crm-atfs

#### Run AWS Lambda node functions locally with a mock API Gateway
- `npm install`
- `npm start` to start serverless locally with default ports

### Git Hooks

Please set up the following prepush git hook in .git/hooks/pre-push

```
#!/bin/sh
npm run prepush && git log -p | scanrepo

```

#### Security

Please install and run the following securiy programs as part of your testing process:

https://github.com/awslabs/git-secrets

- After installing, do a one-time set up with `git secrets --register-aws`. Run with `git secrets --scan`.

https://github.com/UKHomeOffice/repo-security-scanner

- After installing, run with `git log -p | scanrepo`.

These will be run as part of prepush so please make sure you set up the git hook above so you don't accidentally introduce any new security vulnerabilities.

### Testing
In order to test, you need to run the following:
- `npm run test` for unit tests
- `npm run test-i` for integration tests

### Environmental variables

- The `ENV` environment variable indicates in which environment is this application running. Use `ENV=local` for local deployment. This variable is required when starting the application or running tests.
