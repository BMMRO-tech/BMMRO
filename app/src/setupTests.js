// setupTests.js

// jest-dom adds custom jest matchers for asserting on DOM nodes
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import "mutationobserver-shim";
global.MutationObserver = window.MutationObserver;

jest.setTimeout(60000);

import * as rtl from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// keep a reference to the original render method
const originalRender = rtl.render;

// custom render function that wraps ui in MemoryRouter
rtl.render = (ui, options) => {
  return originalRender(<MemoryRouter>{ui}</MemoryRouter>, options);
};