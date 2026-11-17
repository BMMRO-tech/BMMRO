# E2E Tests

## Installation

- Run `npm install`
- If running the tests on Safari, run `safaridriver --enable` and type computer password when prompted
- Create a `.env` file with the following format:
  ```
  ENDPOINT="http://localhost:3000"
  PROJECT_ID="bmmro-xxxxx"
  API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  AUTH_DOMAIN="bmmro-xxxxx.firebaseapp.com"
  EMAIL=e2e@test.ie
  PASSWORD=123456
  DRIVER="safari" | "chrome"
  ```
- The PROJECT_ID, API_KEY and AUTH_DOMAIN values should be the app `.env` file pulled from your firebase console
- `DRIVER` should be one of `chrome` or `safari` depending on the browser you want to test on
- In your firebase console, open build -> authentication -> users and add a new dummy test user with the email (e2e@test.ie) with the password: 123456

## Running the tests

- Start the application
- In a separate terminal, run `npm test` (this excludes the offline tests, see below)

## Offline tests

The `offline support` journey checks that the app loads when refreshed offline and that changes made offline sync once the user is back online. It uses Chrome's network emulation, so:

- It only runs with `DRIVER="chrome"` and is skipped on Safari.
- The service worker only exists in production builds, so it can't run against the Vite dev server (`npm start`). Serve a production build instead, and point `ENDPOINT` at it:
  ```
  cd ../app
  npm run build
  npm run preview
  ```
  Then, in `e2e-tests`, with `ENDPOINT="http://localhost:4173"` and `DRIVER="chrome"` in `.env`:
  ```
  npm run test:offline
  ```
- In GitHub Actions it runs as its own step after the main tests, against the deployed environment, which is a production build, so no extra setup is needed.

## GitHub Actions CI

We run the E2E tests following a deployment to dev or UAT in our GitHub Actions. This is not a blocking job as they run against the environment the application has been deployed to.

In the CI, the tests are run on Chrome. This conflicts with the browser that most users will be using (Safari), but there are known issues with Selenium tests running on safaridriver (https://developer.apple.com/forums/thread/123685) which produces flaky tests.
