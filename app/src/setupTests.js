// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import "mutationobserver-shim";
global.MutationObserver = window.MutationObserver;

// The jsdom test environment no longer provides Node's setImmediate, which the
// Firebase SDK relies on. Polyfill it so the Firestore emulator client works.
if (typeof global.setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
  global.clearImmediate = (id) => clearTimeout(id);
}
