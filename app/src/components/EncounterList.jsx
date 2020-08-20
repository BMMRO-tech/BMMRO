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

const EncounterList = ({ title, items, loadMore, shouldLoadMore, isToday }) => {
  return (
    <div css={utilities.list.container}>
      <ListHeader title={title} />
      {!items.length ? (
        <div css={utilities.list.noEntries}>No encounters yet</div>
      ) : (
        items.map((item, i) => (
          <ul key={`encounterList-${i}`} css={utilities.list.items}>
            {!isToday && <ListSubheader title={`${item.month} ${item.year}`} />}
            {!item.entries.length ? (
              <div css={utilities.list.noEntries}>
                No encounters in {item.month}
              </div>
            ) : (
              item.entries.map((entry) => {
                const {
                  startTimestamp,
                  sequenceNumber,
                  species,
                  area,
                  startTime,
                } = entry.data;

                const day = format(startTimestamp, "dd", {
                  locale: usLocale,
                });
                const month = format(startTimestamp, "MMM", {
                  locale: usLocale,
                });

                return (
                  <ListItem
                    key={entry.id}
                    destinationUrl={generateOpenEncounterURL(entry.id)}
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
      {!!loadMore && <LoadMoreButton handleClick={loadMore} />}
    </div>
  );
};

export default EncounterList;
