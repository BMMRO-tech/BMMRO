## Installing

- npm install
- Create .env file with the correct values which can be found inside the firebaseConfig
```
PROJECTID=123
APIKEY=123
AUTHDOMAIN=123
STORAGEBUCKET=123
```
- Create cypress.json file with the email and password from your firebase user
```
{
    "baseUrl": "http://localhost:3000",
    "env": {
        "email": "youremail",
        "password": "yourpassword"
    }
}
```
- Create serviceAccount.json file
- Go in the service account section of the firebase project settings
- Click Generate a new private key, this downloads a json file to your computer
- Copy the information in the file and paste them in serviceAccount.json

## Running the tests

npx cypress run --spec "./pathtofile" --headed