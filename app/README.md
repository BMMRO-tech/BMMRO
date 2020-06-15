## Stack

- [ReactJS](https://create-react-app.dev/docs/getting-started/) (create-react-app)
- [Emotion](https://emotion.sh/docs/introduction) (styling)
- [Formik](https://jaredpalmer.com/formik/docs/overview) (Form Management)
- [Jest](https://jestjs.io/docs/en/getting-started) (Testing)
- [Prettier](https://prettier.io/docs/en/index.html) (Code Formatting)

- Google Firebase
  - [Cloud Firestore](https://firebase.google.com/docs/firestore) (Database)
  - [Firebase Hosting](https://firebase.google.com/docs/hosting) (Website hosting)
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

## Milestones for Habitat Use form

- [User Testing](https://github.com/BMMRO-tech/BMMRO/milestone/2) - This is our first milestone allowing the application to be tested by real users in real conditions.
- [Production](https://github.com/BMMRO-tech/BMMRO/milestone/1) - The initial release of the application. The tasks included in this milestone are required to be complete before we can safely recommend for this system to replace the paper form.

## Running and Building the app

To run the app in development mode a .env file is required with REACT_APP_PROJECT_ID, REACT_APP_API_KEY and REACT_APP_AUTH_DOMAIN set. These values can be found in the project settings in Firebase.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

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
