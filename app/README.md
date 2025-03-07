## Stack

- [ReactJS](https://create-react-app.dev/docs/getting-started/) (create-react-app)
- [Emotion](https://emotion.sh/docs/introduction) (styling)
- [Formik](https://jaredpalmer.com/formik/docs/overview) (Form Management)
- [Jest](https://jestjs.io/docs/en/getting-started) (Testing)
- [Prettier](https://prettier.io/docs/en/index.html) (Code Formatting)

- Google Firebase
  - [Cloud Firestore](https://firebase.google.com/docs/firestore) (Database)
  - [Firebase Hosting](https://firebase.google.com/docs/hosting) (Website hosting)
  - [Firebase Authentication](https://firebase.google.com/docs/auth) (Authentication)
- [Github Actions](https://help.github.com/en/actions/getting-started-with-github-actions/about-github-actions) (Deployment/CI) - Github secrets are used to store Cloud Firestore Project ID and Firebase deployment token.

## Offline Support

Offline support is a key requirement as researchers will be using this app while out at sea with no internet connection. In order to ensure this the following decisions were made:

- Enabling offline persistence in firebase.
- Ensuring the app can be accessed offline as a Progressive Web App (PWA).

The app will recognise when the device is offline and save the data locally. Once the device is back online the data will automatically be uploaded to Firestore.

Limitations of this method include:

- The app must be loaded at least once on the users device before going offline.
- Not all browsers support offline persistence (only supported on Chrome, Safari and Firefox).
- Persistence can only be enabled in one browser tab at a time.
- As progressive web apps are aggressively cached the user may be presented with an old version of the app.
- PWA installation popup is not reliable and user may need to do extra work to install to home screen.
- PWA installation is not supported on Chrome in iOS.
- App need to be open to upload data once back online.

## Testing Strategy

Since forms are the core component of the application we intend to test their functionality and validation extensively. The firebase datastore has been decoupled from the react application allowing it to be unit tested.

## Milestones for the Trip and Logbook Entries

- [Create Trips and Logbook Entries](https://github.com/BMMRO-tech/BMMRO/milestone/3) Trips can now be recorded in the app instead of being noted down on paper.
- [Editing Trips and Logbooks](https://github.com/BMMRO-tech/BMMRO/milestone/4) After creating a trip or a logbook entry, they can still be edited.
- [Ending a Trip](https://github.com/BMMRO-tech/BMMRO/milestone/5) Trips have to be ended before they can be exported.
- [Exporting Logbook data to MS Access DB](https://github.com/BMMRO-tech/BMMRO/milestone/6) The logbook entries can now be exported to MS Access DB.

## Milestones for Habitat Use form

- [User Testing](https://github.com/BMMRO-tech/BMMRO/milestone/2) - This is our first milestone allowing the application to be tested by real users in real conditions.
- [Production](https://github.com/BMMRO-tech/BMMRO/milestone/1) - The initial release of the application. The tasks included in this milestone are required to be complete before we can safely recommend for this system to replace the paper form.

## A Note on State Management

We've hoisted react state that is to be shared among components into react context. State pertaining to firebase is in FirebaseContext.

For all persistence-related things, we're using firebase. Submitted forms are also stored locally as is enabled by the `firestore.enablePersistence()` method. The exception is that we additionally store the `loggedInUser` in localStorage to prevent redirection to the login page while firebase auth is initializing.

## Running and Building the app

### To run the app locally either you need to set up your own Firebase project, or you can use the development environment project:

1. Create a Firebase account [here](https://console.firebase.google.com/) if you don't have one.
2. Create a new project.
3. Add a web app to your project (register web app without setting up Firebase Hosting). This will generate firebaseConfig.
4. Create `.env` file in `app` directory. It will be ignored in version control. Add the authDomain, apikey and projectId to the `.env` file. 
5. To run the app locally you requires `apiKey`, `authDomain`, `projectId` to initialize the app. apikey and projectId can be found in the project settings in the firebase console and authDomain can be found in the Authorization settings in the firebase console.
6. Set those values found from the Firebase Console as shown in the below example into the `.env` file 

e.g
```
REACT_APP_PROJECT_ID="bmmro-xxxx"
REACT_APP_API_KEY="AIzp-xxxxxxxxxxxxxxxxxxxxx"
REACT_APP_AUTH_DOMAIN="bmmro-xxxx"
```

- set `REACT_APP_PROJECT_ID` to `projectId`
- set `REACT_APP_API_KEY` to `apiKey`
- set `REACT_APP_AUTH_DOMAIN` to `authDomain`


6.  In the main Firebase console, navigate to the Build tab on the left-hand side and then to Authentication, and set up sign-in method to email/password.
7.  Go to Users tab and add new user. You will be able to log in locally with these credentials.

## Setting up your database

With `npm start` running, you will be able to see the BMMRO webapp at localhost. However, it is not connected to a database.

1. Open the JavaScript console in Chrome and follow the link to set up the Cloud Firestore API.
2. Accept the T&Cs and click 'enable'.
3. Go back to your Fire*base* console. Select the Build tab, then Firestore Database. Click create database, and select to start in test mode then choose your region.
4. Go to the 'Rules' tab, delete lines 5 AND 6 and replace with `allow read, write: if true;`. Click publish.
5. Refresh localhost and follow the link in the error after 'You can create it here:'. Click Save.
6. Once the wheels have stopped spinning, your database is set up and your app is ready to use! XD

### Setting up your database emulator

The app uses a Firestore emulator for running tests against. To authenticate this, run `npx firestore login` and follow the commands.

In the `app` directory, install all dependencies:

### `npm install`

And start the app:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

If you recieve a timeout error when running the tests, the test timeout can be extended. This is done by adding a number higher than the default (5000) as the second test argument (see [jest docs](https://jestjs.io/docs/en/api#testonlyeachtablename-fn)). This change should only be made locally and not pushed to master.

### `npm run test-firestore`

Runs the Firebase tests using the Firebase emulator.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run format`

Automatically format all code in `src` using [prettier](https://prettier.io/).

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

```

```
