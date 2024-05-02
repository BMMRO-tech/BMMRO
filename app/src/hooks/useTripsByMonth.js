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

const extractTripProperties = (trip) => {
  const { date, area, tripId, time } = trip.data;
  return {
    id: trip.id,
    data: {
      date,
      area,
      tripId,
      time,
    },
  };
};

const getTripsByTimeRange = async (datastore, startDate, endDate) => {
  const trips = await datastore.readDocsByTimeRange(
    CollectionNames.TRIP,
    "date",
    startDate,
    endDate
  );

  const month = format(startDate, "MMMM", { locale: usLocale });
  const year = getYear(startDate);

  if (!trips.length) {
    return [{ month, year, entries: [] }];
  }

  const extractedTrips = trips.map((trip) => extractTripProperties(trip));

  const orderedTrips = orderTripsByTimestamp(extractedTrips);

  return [{ month, year, entries: orderedTrips }];
};

const orderTripsByTimestamp = (trips) => {
  const sortedTrips = trips.sort((tripA, tripB) => {
    const tripAStartDateTime = constructDateTime(
      tripA.data.time,
      tripA.data.time
    );
    const tripBStartDateTime = constructDateTime(
      tripB.data.time,
      tripB.data.time
    );

    return tripAStartDateTime > tripBStartDateTime ? -1 : 1;
  });

  return sortedTrips;
};

const calculatePreviousMonthTimeRange = (currentMonth) => {
  const previousMonth = subMonths(currentMonth, 1);
  return [startOfMonth(previousMonth), startOfMonth(currentMonth)];
};

const useTripsByMonth = (datastore) => {
  const [todaysTrips, setTodaysTrips] = useState([]);
  const [previousTrips, setPreviousTrips] = useState([]);
  const [timeRange, setTimeRange] = useState();
  const [counter, setCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getInitialTrips = async (today, tomorrow) => {
    await getTripsByTimeRange(datastore, today, tomorrow).then(setTodaysTrips);
    await getTripsByTimeRange(datastore, startOfMonth(today), today).then(
      setPreviousTrips
    );

    setIsLoading(false);
  };

  useEffect(() => {
    const today = startOfDay(getCurrentDate());
    const tomorrow = addDays(today, 1);

    if (!!datastore) {
      getInitialTrips(today, tomorrow);
      setTimeRange(calculatePreviousMonthTimeRange(today));
      setCounter(counter + 1);
    }
    // eslint-disable-next-line
  }, [datastore]);

  if (counter === 12) return { todaysTrips, previousTrips, isLoading };

  const loadPreviousMonth = async () => {
    if (!timeRange) return;
    setIsLoading(true);
    await getTripsByTimeRange(datastore, ...timeRange).then((data) =>
      setPreviousTrips([...previousTrips, ...data])
    );
    setIsLoading(false);

    const [currentStartOfMonth] = timeRange;
    setTimeRange(calculatePreviousMonthTimeRange(currentStartOfMonth));
    setCounter(counter + 1);
  };

  return { todaysTrips, previousTrips, loadPreviousMonth, isLoading };
};

export { useTripsByMonth, getTripsByTimeRange };
