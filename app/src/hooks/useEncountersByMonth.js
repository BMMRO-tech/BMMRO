import { useState, useEffect } from "react";
import {
  startOfDay,
  addDays,
  startOfMonth,
  format,
  getYear,
  subMonths,
} from "date-fns";
import usLocale from "date-fns/locale/en-US";

import { CollectionNames } from "../constants/datastore";
import { getCurrentDate, constructDateTime } from "../utils/time";

const extractEncounterProperties = (encounter) => {
  const { startTimestamp, species, area, sequenceNumber, startTime } =
    encounter.data;
  return {
    id: encounter.id,
    data: {
      startTimestamp,
      species,
      area,
      sequenceNumber,
      startTime,
    },
  };
};

const getEncountersByTimeRange = async (datastore, startDate, endDate) => {
  const encounters = await datastore.readDocsByTimeRange(
    CollectionNames.ENCOUNTER,
    "startTimestamp",
    startDate,
    endDate
  );

  const month = format(startDate, "MMMM", { locale: usLocale });
  const year = getYear(startDate);

  if (!encounters.length) {
    return [{ month, year, entries: [] }];
  }

  const extractedEncounters = encounters.map((encounter) =>
    extractEncounterProperties(encounter)
  );

  const orderedEncounters = orderEncountersByTimestamp(extractedEncounters);

  return [{ month, year, entries: orderedEncounters }];
};

const orderEncountersByTimestamp = (encounters) => {
  const sortedEncounters = encounters.sort((encounterA, encounterB) => {
    const encounterAStartDateTime = constructDateTime(
      encounterA.data.startTimestamp,
      encounterA.data.startTime
    );
    const encounterBStartDateTime = constructDateTime(
      encounterB.data.startTimestamp,
      encounterB.data.startTime
    );

    return encounterAStartDateTime > encounterBStartDateTime ? -1 : 1;
  });

  return sortedEncounters;
};

const calculatePreviousMonthTimeRange = (currentMonth) => {
  const previousMonth = subMonths(currentMonth, 1);
  return [startOfMonth(previousMonth), startOfMonth(currentMonth)];
};

const useEncountersByMonth = (datastore) => {
  const [todaysEncounters, setTodaysEncounters] = useState([]);
  const [previousEncounters, setPreviousEncounters] = useState([]);
  const [timeRange, setTimeRange] = useState();
  const [counter, setCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getInitialEncounters = async (today, tomorrow) => {
    await getEncountersByTimeRange(datastore, today, tomorrow).then(
      setTodaysEncounters
    );
    await getEncountersByTimeRange(datastore, startOfMonth(today), today).then(
      setPreviousEncounters
    );

    setIsLoading(false);
  };

  useEffect(() => {
    const today = startOfDay(getCurrentDate());
    const tomorrow = addDays(today, 1);

    if (!!datastore) {
      getInitialEncounters(today, tomorrow);
      setTimeRange(calculatePreviousMonthTimeRange(today));
      setCounter(counter + 1);
    }
    // eslint-disable-next-line
  }, [datastore]);

  if (counter === 12)
    return { todaysEncounters, previousEncounters, isLoading };

  const loadPreviousMonth = async () => {
    if (!timeRange) return;
    setIsLoading(true);
    await getEncountersByTimeRange(datastore, ...timeRange).then((data) =>
      setPreviousEncounters([...previousEncounters, ...data])
    );
    setIsLoading(false);

    const [currentStartOfMonth] = timeRange;
    setTimeRange(calculatePreviousMonthTimeRange(currentStartOfMonth));
    setCounter(counter + 1);
  };

  return { todaysEncounters, previousEncounters, loadPreviousMonth, isLoading };
};

export default useEncountersByMonth;
