# Migrating BMMRO from Create React App to Vite

## Overview

This guide covers migrating the `app/` package from `react-scripts` (CRA) to Vite + Vitest. The main motivations are faster dev-server startup, faster HMR, and dropping the `--openssl-legacy-provider` workaround that CRA requires on modern Node versions.

The Firebase emulator integration is preserved — Vitest replaces Jest as the test runner but still runs inside `firebase emulators:exec`.

---

## 0. Create an Architectural Decision Record

Before making any code changes, record the decision in a new file in `architectural-decision-records/` following the existing format used in that directory:

**Filename:** `architectural-decision-records/YYYY-MM-DD_migrate-to-vite-and-vitest.md`

```markdown
# Migrate from Create React App to Vite and Vitest

**Status:** Accepted

## Context

The project uses Create React App (`react-scripts`) as its build tool and Jest
as its test runner. Several issues have accumulated:

- CRA requires the `--openssl-legacy-provider` flag on Node 18+ due to an
  unresolved upstream OpenSSL compatibility issue, indicating the project is
  no longer actively maintained.
- CRA's webpack-based dev server has significantly slower cold-start and HMR
  times compared to modern alternatives.
- Jest requires Babel to transform ESM dependencies (e.g. `date-fns`), adding
  configuration overhead and a separate transform pipeline from the build tool.
- The same Babel overhead applies to the `e2e-tests/` and `export-script/`
  packages.

We needed a replacement that:
- Works with the existing React 16 codebase without requiring a React upgrade.
- Removes the OpenSSL workaround.
- Reduces build and test configuration complexity.
- Is actively maintained with broad ecosystem adoption.

## Options

### Option 1 - Vite + Vitest
Benefits:
- Native ESM dev server with significantly faster cold-start and HMR.
- Vitest reuses Vite's transform pipeline, eliminating the need for Babel in
  tests.
- `envPrefix` option allows existing `REACT_APP_*` environment variable names
  to be retained without renaming `.env` files or CI secrets.
- Actively maintained with broad adoption across the React ecosystem.
- `globals: true` mode means existing test files require minimal changes.

Drawbacks:
- `index.html` must move from `public/` to the project root.
- All `process.env.*` references in client-side code must be updated to
  `import.meta.env.*`.
- `jest.mock` / `jest.fn` calls must be updated to `vi.mock` / `vi.fn`.
- The custom Jest test environment (`firestore.testEnvironment.js`) must be
  replaced.

### Option 2 - Remain on CRA
Benefits:
- No migration effort required.

Drawbacks:
- The `--openssl-legacy-provider` workaround remains indefinitely.
- CRA is in maintenance mode; security and compatibility issues are unlikely
  to be resolved upstream.

## Decision

### ✅ Vite + Vitest

Vite and Vitest address all of the identified issues and are the de facto
standard replacements for CRA in the React ecosystem. The migration cost is
low — most changes are mechanical find-and-replace updates.

## Links

- [Vite documentation](https://vite.dev)
- [Vitest documentation](https://vitest.dev)
- [CRA maintenance status](https://github.com/facebook/create-react-app/issues/13072)
```

---

## 1. Install Vite, Vitest, and replace CRA dependencies

```bash
cd app

# Add Vite, the React plugin, Vitest, and jsdom (browser-like test environment)
npm install --save-dev vite @vitejs/plugin-react vitest @vitest/coverage-v8 jsdom

# Remove react-scripts
npm uninstall react-scripts
```

---

## 2. Create `vite.config.js`

Create `app/vite.config.js` with both the build config and the Vitest test config:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envPrefix: "REACT_APP_",
  build: {
    outDir: "build",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    testTimeout: 60000,
    deps: {
      inline: ["date-fns"],
    },
  },
});
```

> **`globals: true`** makes `describe`, `it`, `expect`, `vi`, `beforeAll`, etc. available without importing them — matching the Jest globals that existing tests rely on.

> **`build.outDir: "build"`** preserves CRA's output directory name. Vite defaults to `dist/`; without this, `firebase.json`'s `"public": "build"` hosting config would break.

> **`deps.inline: ["date-fns"]`** replaces the `transformIgnorePatterns` entry in the old Jest config. `date-fns` v4 ships as ESM-only; inlining it lets Vitest's jsdom environment transform it.

> **React 16 note:** `@vitejs/plugin-react` v4+ uses the automatic JSX transform by default, which requires React 16.14.0+. If you see errors about `react/jsx-runtime` not being found, the installed React version is below 16.14 — add `jsxRuntime: "classic"` to the plugin call: `react({ jsxRuntime: "classic" })`.

---

## 3. Move and update `index.html`

Vite expects `index.html` in the **project root** (i.e. `app/`), not inside `public/`.

```bash
mv app/public/index.html app/index.html
```

Then update the file:

- Replace `%PUBLIC_URL%/` references with `/` (Vite serves the `public/` folder at `/` automatically).
- Add a `<script>` tag pointing at the app entry point — Vite requires this, unlike CRA which injected it automatically.

**Before:**
```html
<link rel="icon" href="%PUBLIC_URL%/favicon.png" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```

**After:**
```html
<link rel="icon" href="/favicon.png" />
<link rel="apple-touch-icon" href="/logo192.png" />
<link rel="manifest" href="/manifest.json" />
```

Add before `</body>`:
```html
<script type="module" src="/src/index.js"></script>
```

---

## 4. Update environment variable access

Vite exposes env vars via `import.meta.env` rather than `process.env`. The `envPrefix: "REACT_APP_"` setting in `vite.config.js` (step 2) means the existing `.env` file and GitHub Actions secrets require **no renaming** — only the access syntax changes in source code.

Update `src/index.js`:

**Before:**
```js
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
};
```

**After:**
```js
const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_API_KEY,
  authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.REACT_APP_PROJECT_ID,
};
```

Search the codebase for any other `process.env.REACT_APP_` references and apply the same substitution:

```bash
grep -r "process\.env\.REACT_APP_" src/
```

### 4a. Update `serviceWorker.js`

`serviceWorker.js` uses two CRA-specific `process.env` variables that are outside the `REACT_APP_` prefix and need separate handling:

| CRA | Vite equivalent |
|---|---|
| `process.env.NODE_ENV === "production"` | `import.meta.env.PROD` (boolean) |
| `process.env.PUBLIC_URL` | `import.meta.env.BASE_URL` |

`import.meta.env.BASE_URL` reflects the `base` option in `vite.config.js` (defaults to `"/"`) — equivalent to CRA's `PUBLIC_URL`.

**Update `src/serviceWorker.js`:**
```js
// Before
if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  // ...
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

// After
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
  // ...
  const swUrl = `${import.meta.env.BASE_URL}/service-worker.js`;
```

---

## 5. Update `package.json` scripts

Replace CRA commands with Vite/Vitest equivalents. The Firebase emulator wrapper (`firebase emulators:exec`) is preserved — only the inner test command changes.

```json
"scripts": {
  "start": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "TZ=UTC firebase emulators:exec --only firestore 'vitest run'",
  "test-ci": "TZ=UTC firebase emulators:exec --only firestore 'vitest run --reporter=verbose'",
  "test-watch": "TZ=UTC firebase emulators:exec --only firestore 'vitest'",
  "test-firestore": "firebase emulators:exec --only firestore 'vitest run --config firestore/vitest.config.js'",
  "coverage": "TZ=UTC firebase emulators:exec --only firestore 'vitest run --coverage'",
  "format": "prettier --write src/ firestore/",
  "format-check": "prettier --check src/ firestore/"
}
```

> **`test-nowatch` is removed** — `vitest run` is non-watch by default, so `test-nowatch` would be identical to `test`. Use `test-watch` for watch mode.

> **`test-firestore`** uses a separate Vitest config with `environment: "node"` — see step 9 for the full migration of the `firestore/` test suite, including deleting the custom Jest environment file.

> **`coverage`** generates a coverage report using `@vitest/coverage-v8` (installed in step 1). Reports are written to `coverage/` by default.

The `eject` script can be removed — it has no Vite equivalent.

> **Dev server port:** Vite defaults to port **5173** rather than CRA's 3000. Run `npm start` and check the terminal for the actual URL. To pin it to 3000, add `server: { port: 3000 }` to `vite.config.js`.

---

## 6. Update ESLint config

The `react-app` ESLint ruleset ships with `react-scripts` and won't be available after removing it. Install it alongside `eslint` (its only peer dependency — the plugins bundle with the package):

```bash
npm install --save-dev eslint-config-react-app eslint
```

Then update the `eslintConfig` in `package.json`:

```json
"eslintConfig": {
  "extends": ["react-app", "react-app/jest"],
  "globals": {
    "vi": "readonly"
  }
}
```

`react-app/jest` declares the standard test globals (`describe`, `it`, `expect`, etc.) for files in `__tests__/` and `*.test.*`. Without it, ESLint flags those as undefined after CRA's integration is removed. The `vi` global must be added explicitly — `react-app/jest` only knows about Jest's globals and will otherwise flag every `vi.fn()` and `vi.mock()` call as a reference to an undefined variable.

---

## 7. Migrate tests from Jest to Vitest

### 7a. Update `setupTests.js`

Remove the `jest.setTimeout` call (timeout is now set in `vite.config.js`). The rest of the file stays the same.

**Before:**
```js
import "@testing-library/jest-dom";
import "mutationobserver-shim";
global.MutationObserver = window.MutationObserver;

if (typeof global.setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
  global.clearImmediate = (id) => clearTimeout(id);
}

jest.setTimeout(60000);
```

**After:**
```js
import "@testing-library/jest-dom";
import "mutationobserver-shim";
global.MutationObserver = window.MutationObserver;

if (typeof global.setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
  global.clearImmediate = (id) => clearTimeout(id);
}
```

### 7b. Replace `jest.*` API calls with `vi.*`

Vitest mirrors the Jest API but uses the `vi` namespace. With `globals: true` in the config, `vi` is available as a global (no import needed).

| Jest | Vitest |
|---|---|
| `jest.fn()` | `vi.fn()` |
| `jest.spyOn(obj, method)` | `vi.spyOn(obj, method)` |
| `jest.mock('module')` | `vi.mock('module')` |
| `jest.clearAllMocks()` | `vi.clearAllMocks()` |
| `jest.resetAllMocks()` | `vi.resetAllMocks()` |
| `jest.restoreAllMocks()` | `vi.restoreAllMocks()` |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |

All other globals (`describe`, `it`, `test`, `expect`, `beforeAll`, `afterAll`, `beforeEach`, `afterEach`) are identical between Jest and Vitest and do not need changes.

### 7c. Remove the `jest` block from `package.json`

The `jest` config block is no longer used — equivalent settings are now in `vite.config.js`. Remove the entire block:

```json
// DELETE this entire block from package.json:
"jest": {
  "resetMocks": false,
  "transformIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\](?!date-fns[/\\\\]).+\\.(js|jsx|mjs|cjs|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$"
  ]
}
```

`resetMocks: false` is Vitest's default and does not need to be set explicitly. `transformIgnorePatterns` is replaced by `deps.inline` in `vite.config.js`.

---

## 8. Migrate `e2e-tests` from Jest to Vitest

The `e2e-tests/` package is independent of `app/` and has its own Jest setup. It uses Selenium WebDriver and Firebase directly — no DOM, no React. The package is already `"type": "module"` (ESM), so Vitest can replace Jest without needing Babel at all.

### 8a. Install Vitest and remove Babel + Jest

```bash
cd e2e-tests

npm install --save-dev vitest

npm uninstall jest babel-jest @babel/core @babel/preset-env
```

### 8b. Create `vitest.config.js`

Create `e2e-tests/vitest.config.js`:

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 50000,
  },
});
```

> **`environment: "node"`** — these are Selenium tests with no browser DOM simulation needed, unlike the `app/` tests which use `jsdom`.

> **`testTimeout: 50000`** — matches the `testTimeout` variable already used in `index.test.js`. Individual `it()` and `beforeAll()` calls that pass a timeout argument still override this per-test.

### 8c. Update `package.json` script

```json
"scripts": {
  "test": "vitest run"
}
```

### 8d. Delete the Babel and Jest config files

```bash
rm e2e-tests/jest.config.cjs
rm e2e-tests/babel.config.cjs
```

The `transformIgnorePatterns` in `jest.config.cjs` excluded `lit` from transpilation — `lit` is not in the dependencies, and Vitest handles ESM natively, so no equivalent config is needed.

### 8e. No changes to `index.test.js`

The test file uses only standard globals (`describe`, `it`, `expect`, `beforeAll`, `afterAll`) and passes timeouts as arguments to `it()` and `beforeAll()` — both of which Vitest supports identically. No edits are required.

---

## 9. Migrate `app/firestore/` tests from Jest to Vitest

The `app/firestore/` directory contains Firestore security rules tests that run via a separate `test-firestore` script and a custom Jest environment (`firestore.testEnvironment.js`). This is distinct from the React unit tests in `app/src/`.

### 9a. Why the custom test environment can be deleted

`firestore.testEnvironment.js` subclasses `jest-environment-node` solely to polyfill `fetch`, `Headers`, `Request`, and `Response` — because older Jest versions ran in a Node environment that didn't expose these globals. Node 18+ provides all four natively, so no polyfill is needed. The file can simply be deleted.

```bash
rm app/firestore/firestore.testEnvironment.js
```

### 9b. Create `app/firestore/vitest.config.js`

The firestore tests need a separate config from the main `app/` Vitest config because they run in a `node` environment (no DOM) and need a different timeout. Create `app/firestore/vitest.config.js`:

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 30000,
  },
});
```

### 9c. Update the `test-firestore` script in `app/package.json`

**Before:**
```json
"test-firestore": "firebase emulators:exec --only firestore 'jest firestore/ --testEnvironment=./firestore/firestore.testEnvironment.js --testTimeout=30000'"
```

**After:**
```json
"test-firestore": "firebase emulators:exec --only firestore 'vitest run --config firestore/vitest.config.js'"
```

### 9d. No changes to `firestore.test.js`

The test file uses only standard globals and `require()` — no `jest.*` API calls. Vitest handles CommonJS files natively.

---

## 10. Migrate `export-script/` from Jest to Vitest

The `export-script/` package is a standalone Node.js package (no React, no DOM) with 26 test files. It uses the Firebase emulator for integration tests and `jest.mock`/`jest.fn` in one test file.

### 10a. Install Vitest and remove Jest

```bash
cd export-script

npm install --save-dev vitest

npm uninstall jest
```

### 10b. Create `vitest.config.mjs`

The package has no `"type": "module"`, so use a `.mjs` extension to ensure the config is treated as ESM:

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    fileParallelism: false,
  },
});
```

> **`fileParallelism: false`** runs test files serially — the equivalent of Jest's `--runInBand`. This is needed here for the same reason: concurrent Firestore emulator writes across test files would interfere with each other.

### 10c. Update the `test` script in `export-script/package.json`

**Before:**
```json
"test": "firebase emulators:exec --only firestore 'jest ./src --runInBand'"
```

**After:**
```json
"test": "firebase emulators:exec --only firestore 'vitest run'"
```

### 10d. Update `writeDataToFile.test.js`

This is the only test file in `export-script/` that uses Jest-specific APIs. Replace `jest.mock` and `jest.fn` with their `vi` equivalents:

**Before:**
```js
jest.mock("fs");
jest.mock("../helpers/logAndExit");
jest.mock("../helpers/logToStdErrAndExit");
const fs = require("fs");
// ...

beforeAll(() => {
  fs.existsSync = jest.fn(() => true);
});

// ...
  fs.writeFileSync = jest.fn(() => {
```

**After:**
```js
vi.mock("fs");
vi.mock("../helpers/logAndExit");
vi.mock("../helpers/logToStdErrAndExit");
const fs = require("fs");
// ...

beforeAll(() => {
  fs.existsSync = vi.fn(() => true);
});

// ...
  fs.writeFileSync = vi.fn(() => {
```

All other test files in `export-script/src/__tests__/` use only standard globals and require no changes.

---

## 11. Remove the `browserslist` config from `app/` (optional)

CRA used `browserslist` to configure its Babel output. Vite uses `esbuild` for transforms and targets modern browsers by default. The `browserslist` field in `package.json` will be silently ignored by Vite unless you add the `vite-plugin-legacy` plugin for IE11 support (not needed here).

You can safely delete the `browserslist` field from `package.json`.

---

## 12. Verify the build and tests

```bash
# --- app/ ---
cd app

# Start dev server
npm start

# Run app/src unit tests (requires Firebase emulator)
npm test

# Run Firestore security rules tests (requires Firebase emulator)
npm run test-firestore

# Production build
npm run build

# Preview the production build locally (serves the built output from build/)
npm run preview

# --- e2e-tests/ ---
cd ../e2e-tests
npm test

# --- export-script/ ---
cd ../export-script
npm test
```

Check that:
- Dev server starts on port 5173 (or 3000 if configured)
- Firebase initializes correctly (env vars are picked up from `.env`)
- All routes load
- The service worker registers (check the browser console)
- Production build outputs to `build/` (not `dist/`) and `npm run preview` serves it correctly
- All `app/src` Vitest tests pass
- The `app/` Firestore rules Vitest suite passes independently
- The `e2e-tests/` Vitest suite passes (requires a running app and Safari WebDriver)
- The `export-script/` Vitest suite passes (requires Firebase emulator)

---

## Summary of file changes

| File | Change |
|---|---|
| `architectural-decision-records/YYYY-MM-DD_migrate-to-vite-and-vitest.md` | **Create** — ADR documenting the decision |
| `app/vite.config.js` | **Create** — Vite build config + Vitest test config (`envPrefix`, `build.outDir: "build"`, `deps.inline`) |
| `app/index.html` | **Move** from `public/index.html`; replace `%PUBLIC_URL%` refs; add `<script>` entry point |
| `app/src/index.js` | Replace `process.env.REACT_APP_*` → `import.meta.env.REACT_APP_*` |
| `app/src/serviceWorker.js` | Replace `process.env.NODE_ENV` → `import.meta.env.PROD`; replace `process.env.PUBLIC_URL` → `import.meta.env.BASE_URL` |
| `app/src/setupTests.js` | Remove `jest.setTimeout(60000)` |
| `app/package.json` | Replace `start`/`build` scripts; update test scripts to `vitest run`; add `coverage` script; remove `test-nowatch`; remove `react-scripts`; remove `eject`; remove `jest` config block; optionally remove `browserslist` |
| Any `app/src` test files using `jest.*` | Replace `jest.fn/mock/spyOn/etc` → `vi.fn/mock/spyOn/etc` |
| `app/firestore/vitest.config.js` | **Create** — Vitest config for Firestore rules tests (`node` environment, 30s timeout) |
| `app/firestore/firestore.testEnvironment.js` | **Delete** — `fetch` polyfill no longer needed on Node 18+ |
| `e2e-tests/vitest.config.js` | **Create** — Vitest config for e2e tests (`node` environment, 50s timeout) |
| `e2e-tests/package.json` | Replace `"test": "jest"` → `"test": "vitest run"`; remove `jest`, `babel-jest`, `@babel/core`, `@babel/preset-env` |
| `e2e-tests/jest.config.cjs` | **Delete** |
| `e2e-tests/babel.config.cjs` | **Delete** |
| `export-script/vitest.config.mjs` | **Create** — Vitest config (`node` environment, `fileParallelism: false`) |
| `export-script/package.json` | Replace `"test"` script; remove `jest` dev dependency |
| `export-script/src/__tests__/writeDataToFile.test.js` | Replace `jest.mock`/`jest.fn` → `vi.mock`/`vi.fn` |
