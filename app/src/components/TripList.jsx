/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment, useContext, useEffect, useState } from "react";
import usLocale from "date-fns/locale/en-US";
import { endOfMonth, format, parse } from "date-fns";

import utilities from "../materials/utilities";
import { generateOpenTripURL } from "../constants/routes";
import ListItem from "./list/ListItem";
import ListSubheader from "./list/ListSubheader";
import ListHeader from "./list/ListHeader";
import { monthNames } from "../constants/monthNames";
import fieldStyles from "./formFields/fieldStyles";
import { getTripsByTimeRange } from "../hooks/useTripsByMonth";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { MonthContext } from "../providers/monthContext/MonthContext";

const TripListItem = ({ trip, isToday }) => {
  const { date, tripId, area, time } = trip.data;

  const day = format(date, "dd", {
    locale: usLocale,
  });
  const month = format(date, "MMM", {
    locale: usLocale,
  });

  return (
    <ListItem
      key={trip.id}
      destinationUrl={generateOpenTripURL(trip.id)}
      primaryContentLeft={tripId}
      secondaryContent={area}
    />
  );
};

const getMonthList = () => {
  const today = new Date();
  let monthList = [];
  let date, month, year;
  for (let i = 0; i < 24; i++) {
    date = new Date(today.getUTCFullYear(), today.getMonth() - i, 1);
    year = date.getFullYear();
    month = monthNames[date.getMonth()];
    monthList.push(month + " " + year);
  }

  return monthList;
};

const MonthDropdown = ({
  name,
  labelText,
  onChange,
  options,
  meta,
  short,
  defaultValue,
}) => {
  return (
    <label css={fieldStyles.label}>
      <span>{labelText}</span>
      <div css={fieldStyles.inputContainer}>
        <select
          css={fieldStyles.getInputStyles(meta.error, meta.touched, short)}
          data-testid={`field-${name}`}
          id={name}
          onChange={onChange}
          defaultValue={defaultValue || "Select"}
        >
          {options.map((option) => (
            <option key={option} value={option} aria-label={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
};

const TripsByMonth = () => {
  const { datastore } = useContext(FirebaseContext);
  const { month, setMonth } = useContext(MonthContext);

  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const startDate = parse("1 " + month, "d MMMM yyyy", new Date());
      const endDate = endOfMonth(startDate);
      const response = await getTripsByTimeRange(datastore, startDate, endDate);
      setTrips(response[0]);
      setLoading(false);
    };
    fetchData().then();
  });

  async function getTripsForTheMonth(monthOption) {
    setMonth(monthOption);
    const startDate = parse("1 " + monthOption, "d MMMM yyyy", new Date());
    const endDate = endOfMonth(startDate);

    const tripList = await getTripsByTimeRange(datastore, startDate, endDate);
    setTrips(tripList[0]);
  }

  const getMonthData = async (event) => {
    await getTripsForTheMonth(event.target.value);
  };
  return (
    <Fragment>
      <MonthDropdown
        name="PreviousTripsDropDown"
        labelText="Month"
        options={getMonthList()}
        onChange={getMonthData}
        meta={""}
        defaultValue={month}
      />{" "}
      {!loading && (
        <ul key={`tripList-1`} css={utilities.list.items}>
          <ListSubheader title={`${trips?.month} ${trips?.year}`} />

          {!trips?.entries.length ? (
            <div css={utilities.list.noEntries}>No trips in {trips?.month}</div>
          ) : (
            <Fragment>
              {trips?.entries.map((trip, i) => (
                <TripListItem
                  key={`previous-trip-${i}`}
                  trip={trip}
                  isToday={false}
                />
              ))}
            </Fragment>
          )}
        </ul>
      )}
    </Fragment>
  );
};
const PreviousTrips = () => {
  return TripsByMonth();
};

const TodaysTrips = ({ trips }) => {
  return trips.map((tripsByMonth, i) => (
    <Fragment key={`tripList-${i}`}>
      {!tripsByMonth.entries.length ? (
        <div css={utilities.list.noEntries}>No trips yet</div>
      ) : (
        <ul css={utilities.list.items}>
          {tripsByMonth.entries.map((trip, i) => (
            <TripListItem key={`todays-trip-${i}`} trip={trip} isToday={true} />
          ))}
        </ul>
      )}
    </Fragment>
  ));
};

const TripList = ({ title, trips, isToday }) => {
  return (
    <div css={utilities.list.container}>
      <ListHeader title={title} />
      {!trips.length ? (
        <div css={utilities.list.noEntries}>No trips yet</div>
      ) : isToday ? (
        <TodaysTrips trips={trips} />
      ) : (
        <PreviousTrips />
      )}
    </div>
  );
};

export default TripList;
