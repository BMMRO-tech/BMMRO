# Migrate End to End Tests from Safari to Chrome

**Status:** Accepted

## Context

The current E2E tests run on the Selenium Safari driver. This means that only developers with Apple machines running Safari can run the E2E tests. We need to migrate to a different driver so that developers with Windows or Linux machines can run the tests.

## Options

### Option 1 - Chrome
Benefits:
- Most common browser used for E2E testing
- Allows developers on non-MacOS machines to run the E2E tests

Drawbacks:
- A few changes required to test script
- Updating to a higher version of `selenium-webdriver` required

### Option 2 - Chrome
Benefits:
- Allows developers on non-MacOS machines to run the E2E tests

Drawbacks:
- A few changes required to test script
- Updating to a higher version of `selenium-webdriver` required
- Generally less used than Chrome, potentially more complex troubleshooting

### Option 3 - Remain on Safari
Benefits:
- No migration effort required.

Drawbacks:
- Developers on non-MacOS machines would not be able to run the E2E tests

## Decision

### Chrome

It is necessary to move away from Safari and Chrome is the most commonly used alternative.

## Links

- [Selenium Chrome driver docs](https://www.selenium.dev/documentation/webdriver/browsers/chrome/)
- [Selenium Safari driver docs](https://www.selenium.dev/documentation/webdriver/browsers/safari/)
