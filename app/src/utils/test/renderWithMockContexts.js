import React from "react";
import { render } from "@testing-library/react";
import {
  createHistory,
  createMemorySource,
  BrowserRouter,
} from "react-router-dom";
import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import "@testing-library/jest-dom/extend-expect";
import { MonthContext } from "../../providers/monthContext/MonthContext";

// modified from https://testing-library.com/docs/example-reach-router
export const renderWithMockContexts = (
  ui,
  {
    route = "/",
    history = createHistory(createMemorySource(route)),
    loggedInUser,
    datastore,
    datastoreError,
    month,
  } = {},
) => {
  return {
    ...render(
      <FirebaseContext.Provider
        value={{ loggedInUser, datastore, datastoreError }}
      >
        <MonthContext.Provider value={{ month, setMonth: () => {} }}>
          <BrowserRouter history={history}>{ui}</BrowserRouter>
        </MonthContext.Provider>
      </FirebaseContext.Provider>,
    ),
    history,
  };
};
