## Installation

- run npm install
- run safaridriver --enable and type computer password when prompted
- create .env file with the following format
- The Project_ID, API_KEY and AUTH_DOMAIN values should be the app .env file pulled from your
- In your firebase console, open build -> authentication -> users and a new dummy test user with the email (e2e@test.ie) with the password: 123456 *
    * OR set the email and password below to any valid user from your firebase

firebase setup
```
ENDPOINT="http://localhost:3000"
PROJECT_ID="bmmro-xxxxx"
API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
AUTH_DOMAIN="bmmro-xxxxx.firebaseapp.com"
EMAIL=e2e@test.ie
PASSWORD=123456
```

## Running the script
- run node --experimental-vm-modules node_modules/jest/bin/jest.js
