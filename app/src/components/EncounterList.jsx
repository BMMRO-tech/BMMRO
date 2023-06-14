/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment } from "react";
import usLocale from "date-fns/locale/en-US";
import { format } from "date-fns";

import utilities from "../materials/utilities";
import { generateOpenEncounterURL } from "../constants/routes";
import ListItem from "./list/ListItem";
import ListSubheader from "./list/ListSubheader";
import ListHeader from "./list/ListHeader";
import LoadMoreButton from "./list/LoadMoreButton";
import { Dropdown } from "./formFields/Select/Select";
import { monthNames } from "../constants/monthNames";

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

function previousEncountersByMonth(i, encountersByMonth, enableDropdown) {
  const previousMonths = ["June 2023"];
  return (
    <Fragment>
      {enableDropdown && (
        <Dropdown
          name="PreviousEncountersDropDown"
          labelText="Month"
          meta={""}
          options={getMonthList()}
        />
      )}
      <ul key={`encounterList-${i}`} css={utilities.list.items}>
        <ListSubheader
          title={`${encountersByMonth.month} ${encountersByMonth.year}`}
        />

        {!encountersByMonth.entries.length ? (
          <div css={utilities.list.noEntries}>
            No encounters in {encountersByMonth.month}
          </div>
        ) : (
          <Fragment>
            {encountersByMonth.entries.map((encounter, i) => (
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
}

const PreviousEncounters = ({ encounters, enableDropdown }) => {
  return encounters.map((encountersByMonth, i) =>
    previousEncountersByMonth(i, encountersByMonth, enableDropdown)
  );
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
