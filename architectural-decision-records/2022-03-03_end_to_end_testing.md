# End to end testing 

**Status:** Accepted

## Context

There was no e2e testing in the app, this meant we had to do a lot of manual testing before deploying the app, which was very repeative and time consuming. E2E testing would allow more security when pushing the application, making sure we are not pushing broken code. 

We needed a E2E testing framework that:
- Supports the browsers that the client was using.
- Supports the language of the app, Javascript.
- Gives access to the firebase datastore.
- Gives feedback on what issues in e2e tests.
- Easily maintainable by the developers.


## Options

### Option 1 - Taiko
Benefits:
- Compatible with Chromium based browsers including Firefox
- Highly readable and maintainable
- Supports Javascript
- Creates reports for things that have gone wrong 

Drawbacks: 
- Some known issues with FireFox 
- No documentation on how to link Taiko and Firebase


### Option 2 - Selenium 
Benefits: 
- Compatiable with all browser
- Supports various frameworks and proggramming languages including Javascript
- Creates reports for things that have gone wrong
- Support access to Firebase

Drawbacks 
- Require more setup 
- Not as understandable as Cypress and Takio for someone who is not used to reading code

### Option 3 - Cypress 
Benefits:
- Compatible with Chromium based browsers including Firefox
- Highly readable and maintainable
- Supports Javascript
- Creates reports for things that have gone wrong 
- Supports access to Firebase

Drawbacks: 
- Does not support mobile actions such as swiping

## Decision

### ✅ Cypress 

We chose Cypress as it fitted with all of our criteria, as well as being well documented and easy to pick up. 

## Links

- [Accessing Firebase from Cypress documentation](https://github.com/prescottprue/cypress-firebase) 
- [Cypress Guide](https://www.cypress.io/)