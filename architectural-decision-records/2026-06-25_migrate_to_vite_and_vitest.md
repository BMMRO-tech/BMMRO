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
