/** @jsx jsx */
import { jsx } from "@emotion/core";
import usLocale from "date-fns/locale/en-US";
import { format } from "date-fns";

import utilities from "../materials/utilities";
import { generateOpenEncounterURL } from "../constants/routes";
import ListItem from "./list/ListItem";
import ListSubheader from "./list/ListSubheader";
import ListHeader from "./list/ListHeader";
import LoadMoreButton from "./list/LoadMoreButton";

const EncounterList = ({
  title,
  listOfEncountersByMonth,
  loadMore,
  isToday,
  isLoading,
}) => {
  return (
    <div css={utilities.list.container}>
      <ListHeader title={title} />
      {!listOfEncountersByMonth.length ? (
        <div css={utilities.list.noEntries}>No encounters yet</div>
      ) : (
        listOfEncountersByMonth.map((encountersByMonth, i) => (
          <ul key={`encounterList-${i}`} css={utilities.list.items}>
            {!isToday && (
              <ListSubheader
                title={`${encountersByMonth.month} ${encountersByMonth.year}`}
              />
            )}
            {!encountersByMonth.entries.length ? (
              <div css={utilities.list.noEntries}>
                No encounters in {encountersByMonth.month}
              </div>
            ) : (
              encountersByMonth.entries.map((encounter) => {
                const {
                  startTimestamp,
                  sequenceNumber,
                  species,
                  area,
                  startTime,
                } = encounter.data;

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
                    primaryContent={`${sequenceNumber} ${species}`}
                    secondaryContent={area}
                  />
                );
              })
            )}
          </ul>
        ))
      )}
      {!!loadMore && (
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
