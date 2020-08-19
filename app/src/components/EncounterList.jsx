/** @jsx jsx */
import { jsx } from "@emotion/core";
import usLocale from "date-fns/locale/en-US";
import { format } from "date-fns";

import utilities from "../materials/utilities";
import { generateEditEncounterURL } from "../constants/routes";
import ListItem from "./list/ListItem";
import ListSubheader from "./list/ListSubheader";
import ListHeader from "./list/ListHeader";
import LoadMoreButton from "./list/LoadMoreButton";

const EncounterList = ({ title, items, loadMore, showSubheader }) => {
  const hasMaxItems = items.length >= 12;

  return (
    <div css={utilities.list.container}>
      <ListHeader title={title} />
      {!items.length ? (
        <div css={utilities.list.noEntries}>No encounters yet</div>
      ) : (
        items.map((item, i) => (
          <ul key={`encounterList-${i}`} css={utilities.list.items}>
            {showSubheader && (
              <ListSubheader title={`${item.month} ${item.year}`} />
            )}
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
                } = entry.data;

                return (
                  <ListItem
                    key={entry.id}
                    destinationUrl={generateEditEncounterURL(entry.id)}
                    primaryTime={startTimestamp
                      .getDate()
                      .toString()
                      .padStart(2, "0")}
                    secondaryTime={format(startTimestamp, "MMM", {
                      locale: usLocale,
                    })}
                    primaryContent={`${sequenceNumber} ${species}`}
                    secondaryContent={area}
                  />
                );
              })
            )}
          </ul>
        ))
      )}
      {loadMore ? (
        <LoadMoreButton hasMaxItems={hasMaxItems} handleClick={loadMore} />
      ) : null}
    </div>
  );
};

export default EncounterList;
