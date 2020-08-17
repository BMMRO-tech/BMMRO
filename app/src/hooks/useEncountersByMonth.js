import { useState, useEffect } from "react";
import {
  startOfToday,
  startOfTomorrow,
  startOfMonth,
  format,
  getYear,
  subMonths,
} from "date-fns";
import usLocale from "date-fns/locale/en-US";
import { CollectionNames } from "../constants/datastore";

const extractEncounterProperties = (encounter) => {
  const { startTimestamp, species, area, sequenceNumber } = encounter.data;
  return {
    id: encounter.id,
    data: {
      startTimestamp,
      species,
      area,
      sequenceNumber,
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

  return [{ month, year, entries: extractedEncounters }];
};

const calculatePreviousMonthTimeRange = (currentMonth) => {
  const previousMonth = subMonths(currentMonth, 1);
  return [startOfMonth(previousMonth), startOfMonth(currentMonth)];
};

const useEncountersByMonth = (datastore) => {
  const [todaysEncounters, setTodaysEncounters] = useState([]);
  const [previousEncounters, setPreviousEncounters] = useState([]);
  const [timeRange, setTimeRange] = useState();

  useEffect(() => {
    const today = startOfToday();
    const tomorrow = startOfTomorrow();

    if (!!datastore) {
      getEncountersByTimeRange(datastore, today, tomorrow).then(
        setTodaysEncounters
      );
      getEncountersByTimeRange(datastore, startOfMonth(today), today).then(
        setPreviousEncounters
      );
      setTimeRange(calculatePreviousMonthTimeRange(today));
    }
    // eslint-disable-next-line
  }, [datastore]);

  const getPreviousMonthsData = () => {
    if (!timeRange) return;

    getEncountersByTimeRange(datastore, ...timeRange).then((data) =>
      setPreviousEncounters([...previousEncounters, ...data])
    );
    const [currentStartOfMonth] = timeRange;
    setTimeRange(calculatePreviousMonthTimeRange(currentStartOfMonth));
  };

  return [todaysEncounters, previousEncounters, getPreviousMonthsData];
};

export default useEncountersByMonth;
