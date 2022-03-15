# Deployment Script

## Deployment process

1. Development

When a developer pushes to master, code is auto deployed to the development environment and a 'dev-deployed-XX' tag is added. If a developer makes many commits locally then pushes only the most recent commit is tagged.

2. UAT

To deploy to UAT run the deploy script located in the project ‘deploy-script’ folder passing the environment ('uat') and the build to deploy ('dev-deployed-XX'). This adds a ‘uat-deployed-XX` tag.

3. Production

To deploy to production run the local deploy script passing the environment ('prod') and the build to deploy ('uat-deployed-XX’). This updates the 'Prod' tag to the deployed build.

## Rollback

To rollback, the local deploy script can be run passing 'prod' and an older build tag e.g. 'dev-deployed-11'. It may be enforced that any build must be deployed to UAT before production. In this case to rollback you would first need to deploy an old build to UAT then deploy UAT to production.

## Running the script

1. Clone the repository.
2. Open the deploy-script folder in the terminal.
3. The script can now be run with: `node deploy.js ENVIRONMENT_NAME DEPLOY_TAG`

ENVIRONMENT_NAME - Options: ‘uat’ or ‘prod’

DEPLOY_TAG - Options: ‘dev-deployed-XX’ or ‘uat-deployed-XX’

## How it works

To trigger the deploy action the local script pushes a ‘uat-pending-XX’ or 'prod-pending-XX’ tag. The Github action identifies this tag and starts the deploy process to the corresponding environment. Once the deploy is complete the action sets the final environment tag ('prod-deployed-XX’ or 'uat-deployed-XX’). This means that if a deploy fails the pending tag will be updated however the environment tag will still point to the last successfully deployed build.

## A deployment has failed

First open the Actions tab in Github, then click on the heading for the build that has failed, then click the job heading with the red X on the left. This shows each step and you will be able to see exactly where the deployment failed.

### Failed on: ’Set up job’ or ‘Run actions’

This is likely an issue with Github, try rerunning the action or checking Github status.

### Failed on: Installing dependencies, Running tests or Building bundle

A developer will need to investigate the deployment issue.

### Failed on: ‘Deploy to firebase’

There could be several reasons for this failure:

- The firebase token is invalid and a new one will need to be generated and set in GitHub secrets.
- Firebase maybe down and the action can be rerun.
- The project id may be incorrect. To fix this the GitHub secret for project Id should be updated.

If the deploy fails a XX-pending-XX tag will be created and not removed unless the action is rerun and succeeds.
