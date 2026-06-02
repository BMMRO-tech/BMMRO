const NodeEnvironment = require("jest-environment-node");

// @firebase/rules-unit-testing v5 uses the global `fetch` to talk to the
// emulator, but Jest 27's sandbox does not expose Node's built-in `fetch`.
// Copy the real implementations from the host process into the test global.
class FirestoreTestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    this.global.fetch = fetch;
    this.global.Headers = Headers;
    this.global.Request = Request;
    this.global.Response = Response;
  }
}

module.exports = FirestoreTestEnvironment;
