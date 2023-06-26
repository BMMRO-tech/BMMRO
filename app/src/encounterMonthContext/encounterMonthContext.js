import React, { useState } from "react";
import { monthNames } from "../constants/monthNames";

export const EncounterMonthContext = React.createContext();

export const EncounterMonthProvider = ({ children }) => {
  const today = new Date();
  const month = monthNames[today.getMonth()] + " " + today.getFullYear();
  const [encounterMonth, setEncounterMonth] = useState(month);

  return (
    <EncounterMonthContext.Provider
      value={{ encounterMonth, setEncounterMonth }}
    >
      {children}
    </EncounterMonthContext.Provider>
  );
};
