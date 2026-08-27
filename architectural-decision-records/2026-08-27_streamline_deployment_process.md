# Streamline Deployment Process

**Status:** Accepted

## Context

The current deployment process goes as follows:
  
1. Push to master. Code auto deployed to development environment and 'dev-deployed-XX' tag added.
1. Run local deploy script passing the environment ('uat') and the build to deploy ('dev-deployed-XX'). This adds a "uat-pending-XX" tag, that is updated to "uat-deployed-XX" once the deployment to that environment is successful.
1. Run local deploy script passing the environment ('prod') and the build to deploy ('uat-deployed-XX'). This adds a "prod-pending-XX" tag, that is updated to "prod-deployed-XX" once the deployment to that environment is successful.

There are a couple of issues with this deployment process:

- Application is built every time we deploy to a new environment (as opposed to build an artifact once and promote it to the different environments).
- If the tags that trigger deployments ("uat-pending-XX" and "prod-pending-xx") are added to a branch, that would trigger a deployment too.
- Anyone with permission to create tags can deploy to production without a review. A typo in the `uat-deployed-XX` tag could deploy an incorrect version of the application to production.
- A certain level of technical knowhow is required along with access to an environment with Node.js installed. 
- The deploy script may break with a new version of Node.js.

## Decision

These cons are not ideal, so we decided it was worth investigating other options for deployment.

## Option 1 - Local deploy script (current approach)

No work would be required to keep the current approach, but there are not insignificant cons to this approach as detailed above.

## Option 2 - Auto-promote after successful E2E tests

After the dev E2E job passes, the workflow automatically creates the `uat-pending-XX` tag, which cascades to UAT. After UAT E2E passes, it creates `prod-pending-XX`. 

Pros:
- Fully automated — merging to master eventually propagates to prod without anyone doing anything extra
- Removes all human error from the promotion step
- Not dependent on a developer's personal Node.js version

Cons:
- Loss of intentional control — a bad merge goes straight to prod unless tests catch it
- If E2E tests have flaky failures, you get either rollbacks or blocked pipelines
- Application is built every time we deploy to a new environment (as opposed to build an artifact once and promote it to the different environments)

## Option 3 - `workflow_dispatch` with a version input

Add a `workflow_dispatch: trigger` to `uat.yml` and `prod.yml` with a text input for the version number. A team member goes to the GitHub Actions UI, selects the workflow, types the version, and clicks Run.

Pros:
- Minimal changes required
- Full audit trail (GitHub shows who triggered it and when)
- No technical knowhow required
- Not dependent on a developer's personal Node.js version

Cons:
- The version input is a free-text field, so a typo still fails silently or deploys the wrong thing
- No native approval gate — anyone with Actions write access can trigger it
- Application is built every time we deploy to a new environment (as opposed to build an artifact once and promote it to the different environments)

## Option 4: GitHub Environments with required reviewers

GitHub Environments let you require one or more reviewers to approve a deployment before it proceeds. The workflow still triggers automatically (e.g. after dev succeeds), but pauses and waits for a human to click Approve in the UI.

Pros:
- Structured approval process with a clear approve/reject UI
- Good audit trail — who approved, when
- Can combine with workflow_dispatch or with auto-triggering after dev E2E passes

Cons:
- More configuration — you'd need to set up the environments in repo settings and update the workflow environment: key
- Application is built every time we deploy to a new environment (as opposed to build an artifact once and promote it to the different environments)

## Final decision

We have decided to go with options 3 and 4. The flow is the following:

- Push to master. Code auto deployed to development environment and 'dev-deployed-XX' tag added.
- Trigger a UAT deployment from the GitHub UI. The developer inputs the version number.
- Another developer reviews the deployment in the GitHub Environment. If approved, the workflow goes ahead as normal.
- Trigger a production deployment from the GitHub UI. The developer inputs the version number.
- Another developer reviews the deployment in the GitHub Environment. If approved, the workflow goes ahead as normal.

The rollback process is the same as the current solution, but the deployment is triggered from the GitHub UI and reviewed in the GitHub Environment.

This solution avoids the downsides of running a local script that relies on a developer's local environment and reduces the possibility of deploying an incorrect version of the application thanks to the GitHub Environment review.

## Notes

### Single artifact promotion

It is currently unfeasible to use a single build artifact that is promoted to the different environments as Vite bakes REACT_APP_* variables into the bundle at build time. So a dev-built artifact contains the dev Firebase project ID hardcoded in it. Deploying that same artifact to prod would point users at the dev database. This is why the app is rebuilt per environment.

It may be possible for each Firebase project to host a config file with that environment's credentials that is fetched by the application before initialising Firebase, which would be a significant refactor.
