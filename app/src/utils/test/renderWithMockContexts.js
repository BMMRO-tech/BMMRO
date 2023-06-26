import React from "react";
import { render } from "@testing-library/react";
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router";
import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import "@testing-library/jest-dom/extend-expect";
import { EncounterMonthContext } from "../../encounterMonthContext/encounterMonthContext";

// modified from https://testing-library.com/docs/example-reach-router
export const renderWithMockContexts = (
  ui,
  {
    route = "/",
    history = createHistory(createMemorySource(route)),
    loggedInUser,
    datastore,
    datastoreError,
    encounterMonth,
  } = {}
) => {
  return {
    ...render(
      <FirebaseContext.Provider
        value={{ loggedInUser, datastore, datastoreError }}
      >
        <EncounterMonthContext.Provider
          value={{ encounterMonth, setEncounterMonth: () => {} }}
        >
          <LocationProvider history={history}>{ui}</LocationProvider>)
        </EncounterMonthContext.Provider>
      </FirebaseContext.Provider>
    ),
    history,
  };
};
