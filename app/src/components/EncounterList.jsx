/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment, useContext, useEffect, useState } from "react";
import usLocale from "date-fns/locale/en-US";
import { endOfMonth, format, parse } from "date-fns";

import utilities from "../materials/utilities";
import { generateOpenEncounterURL } from "../constants/routes";
import ListItem from "./list/ListItem";
import ListSubheader from "./list/ListSubheader";
import ListHeader from "./list/ListHeader";
import { monthNames } from "../constants/monthNames";
import fieldStyles from "./formFields/fieldStyles";
import { getEncountersByTimeRange } from "../hooks/useEncountersByMonth";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { MonthContext } from "../providers/monthContext/MonthContext";

const EncounterListItem = ({ encounter, isToday }) => {
  const { startTimestamp, sequenceNumber, species, area, startTime } =
    encounter.data;

  const day = format(startTimestamp, "dd", {
    locale: usLocale,
  });
  const month = format(startTimestamp, "MMM", {
    locale: usLocale,
  });

  return (
    <ListItem
      key={encounter.id}
      destinationUrl={generateOpenEncounterURL(encounter.id)}
      primaryTime={isToday ? startTime : day}
      secondaryTime={!isToday && month}
      primaryContentLeft={sequenceNumber}
      primaryContentRight={species}
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

const EncountersByMonth = () => {
  const { datastore } = useContext(FirebaseContext);
  const { month, setMonth } = useContext(MonthContext);

  const [loading, setLoading] = useState(true);
  const [encounters, setEncounters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const startDate = parse("1 " + month, "d MMMM yyyy", new Date());
      const endDate = endOfMonth(startDate);
      const response = await getEncountersByTimeRange(
        datastore,
        startDate,
        endDate
      );
      setEncounters(response[0]);
      setLoading(false);
    };
    fetchData().then();
  });

  async function getEncountersForTheMonth(monthOption) {
    setMonth(monthOption);
    const startDate = parse("1 " + monthOption, "d MMMM yyyy", new Date());
    const endDate = endOfMonth(startDate);

    const encounterList = await getEncountersByTimeRange(
      datastore,
      startDate,
      endDate
    );
    setEncounters(encounterList[0]);
  }

  const getMonthData = async (event) => {
    await getEncountersForTheMonth(event.target.value);
  };
  return (
    <Fragment>
      <MonthDropdown
        name="PreviousEncountersDropDown"
        labelText="Month"
        options={getMonthList()}
        onChange={getMonthData}
        meta={""}
        defaultValue={month}
      />{" "}
      {!loading && (
        <ul key={`encounterList-1`} css={utilities.list.items}>
          <ListSubheader title={`${encounters?.month} ${encounters?.year}`} />

          {!encounters?.entries.length ? (
            <div css={utilities.list.noEntries}>
              No encounters in {encounters?.month}
            </div>
          ) : (
            <Fragment>
              {encounters?.entries.map((encounter, i) => (
                <EncounterListItem
                  key={`previous-encounter-${i}`}
                  encounter={encounter}
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
const PreviousEncounters = () => {
  return EncountersByMonth();
};

const TodaysEncounters = ({ encounters }) => {
  return encounters.map((encountersByMonth, i) => (
    <Fragment key={`encounterList-${i}`}>
      {!encountersByMonth.entries.length ? (
        <div css={utilities.list.noEntries}>No encounters yet</div>
      ) : (
        <ul css={utilities.list.items}>
          {encountersByMonth.entries.map((encounter, i) => (
            <EncounterListItem
              key={`todays-encounter-${i}`}
              encounter={encounter}
              isToday={true}
            />
          ))}
        </ul>
      )}
    </Fragment>
  ));
};

const EncounterList = ({ title, encounters, isToday }) => {
  return (
    <div css={utilities.list.container}>
      <ListHeader title={title} />
      {!encounters.length ? (
        <div css={utilities.list.noEntries}>No encounters yet</div>
      ) : isToday ? (
        <TodaysEncounters encounters={encounters} />
      ) : (
        <PreviousEncounters />
      )}
    </div>
  );
};

export default EncounterList;
