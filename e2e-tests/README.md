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
- In a separate terminal, run `npm test`

## GitHub Actions CI

We run the E2E tests following a deployment to dev or UAT in our GitHub Actions. This is not a blocking job as they run against the environment the application has been deployed to.

In the CI, the tests are run on Chrome. This conflicts with the browser that most users will be using (Safari), but there are known issues with Selenium tests running on safaridriver (https://developer.apple.com/forums/thread/123685) which produces flaky tests.
