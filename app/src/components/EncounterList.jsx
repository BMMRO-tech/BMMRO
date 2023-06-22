/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment, useContext, useState } from "react";
import usLocale from "date-fns/locale/en-US";
import { endOfMonth, format, parse } from "date-fns";

import utilities from "../materials/utilities";
import { generateOpenEncounterURL } from "../constants/routes";
import ListItem from "./list/ListItem";
import ListSubheader from "./list/ListSubheader";
import ListHeader from "./list/ListHeader";
import LoadMoreButton from "./list/LoadMoreButton";
import { monthNames } from "../constants/monthNames";
import fieldStyles from "./formFields/fieldStyles";
import { getEncountersByTimeRange } from "../hooks/useEncountersByMonth";
import { FirebaseContext } from "../firebaseContext/firebaseContext";

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
  for (let i = 0; i < 12; i++) {
    date = new Date(today.getUTCFullYear(), today.getMonth() - i, 1);
    year = date.getFullYear();
    month = monthNames[date.getMonth()];
    monthList.push(month + " " + year);
  }

  return monthList;
};

const MonthDropdown = ({ name, labelText, onChange, options, meta, short }) => {
  return (
    <label css={fieldStyles.label}>
      <span>{labelText}</span>
      <div css={fieldStyles.inputContainer}>
        <select
          css={fieldStyles.getInputStyles(meta.error, meta.touched, short)}
          data-testid={`field-${name}`}
          id={name}
          onChange={onChange}
        >
          <option key="none" value="" aria-label="default empty option">
            -- Select --
          </option>
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

const EncountersByMonth = (encountersByMonth) => {
  const { datastore } = useContext(FirebaseContext);

  const [encounters, setEncounters] = useState(encountersByMonth);

  async function getEncountersForTheMonth(monthOption) {
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
      />
      <ul key={`encounterList-1`} css={utilities.list.items}>
        <ListSubheader title={`${encounters.month} ${encounters.year}`} />

        {!encounters.entries.length ? (
          <div css={utilities.list.noEntries}>
            No encounters in {encounters.month}
          </div>
        ) : (
          <Fragment>
            {encounters.entries.map((encounter, i) => (
              <EncounterListItem
                key={`previous-encounter-${i}`}
                encounter={encounter}
                isToday={false}
              />
            ))}
          </Fragment>
        )}
      </ul>
    </Fragment>
  );
};
const PreviousEncountersByMonth = (i, encounters) => {
  return (
    <Fragment>
      <ul key={`encounterList-${i}`} css={utilities.list.items}>
        <ListSubheader title={`${encounters.month} ${encounters.year}`} />

        {!encounters.entries.length ? (
          <div css={utilities.list.noEntries}>
            No encounters in {encounters.month}
          </div>
        ) : (
          <Fragment>
            {encounters.entries.map((encounter, i) => (
              <EncounterListItem
                key={`previous-encounter-${i}`}
                encounter={encounter}
                isToday={false}
              />
            ))}
          </Fragment>
        )}
      </ul>
    </Fragment>
  );
};

const PreviousEncounters = ({ encounters, enableDropdown }) => {
  const previousEncountersView = !enableDropdown
    ? encounters.map((encountersByMonth, i) =>
        PreviousEncountersByMonth(i, encountersByMonth, enableDropdown)
      )
    : EncountersByMonth(encounters[0]);
  return previousEncountersView;
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

const EncounterList = ({ title, encounters, loadMore, isToday, isLoading }) => {
  const encountersByMonthDropDownFeatureToggle =
    process.env.REACT_APP_ENCOUNTERS_BY_MONTH_DROPDOWN_FEATURE_TOGGLE ===
    "TRUE";
  return (
    <div css={utilities.list.container}>
      <ListHeader title={title} />
      {!encounters.length ? (
        <div css={utilities.list.noEntries}>No encounters yet</div>
      ) : isToday ? (
        <TodaysEncounters encounters={encounters} />
      ) : (
        <PreviousEncounters
          encounters={encounters}
          enableDropdown={encountersByMonthDropDownFeatureToggle}
        />
      )}
      {!!loadMore && !encountersByMonthDropDownFeatureToggle && (
        <LoadMoreButton
          text="Load previous month"
          handleClick={loadMore}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default EncounterList;
