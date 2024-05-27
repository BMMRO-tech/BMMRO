import React, { useState } from "react";
import { monthNames } from "../../constants/monthNames";

export const MonthContext = React.createContext();

export const MonthProvider = ({ children }) => {
  const today = new Date();
  const currentMonth = monthNames[today.getMonth()] + " " + today.getFullYear();
  const [month, setMonth] = useState(currentMonth);

  return (
    <MonthContext.Provider value={{ month, setMonth }}>
      {children}
    </MonthContext.Provider>
  );
};
