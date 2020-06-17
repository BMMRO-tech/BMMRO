import React from "react";
import { render } from "@testing-library/react";
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import "@testing-library/jest-dom/extend-expect";

// modified from https://testing-library.com/docs/example-reach-router
export const renderWithMockContexts = (
  ui,
  {
    route = "/",
    history = createHistory(createMemorySource(route)),
    loggedInUser,
    datastore,
    datastoreError,
  } = {}
) => {
  return {
    ...render(
      <FirebaseContext.Provider
        value={{ loggedInUser, datastore, datastoreError }}
      >
        <LocationProvider history={history}>{ui}</LocationProvider>)
      </FirebaseContext.Provider>
    ),
    history,
  };
};
