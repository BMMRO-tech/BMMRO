/** @jsx jsx */
import { jsx } from "@emotion/core";
import ListSubheader from "./list/ListSubheader";
import ListItem from "./list/ListItem";
import utilities from "../materials/utilities";
import ListHeader from "./list/ListHeader";
import LoadMoreButton from "./list/LoadMoreButton";

const EncounterList = ({ title, items, loadMore }) => {
  return (
    <div css={utilities.list.container}>
      <ListHeader title={title} />
      {!items.length ? (
        <div css={utilities.list.noEntries}>No encounters yet</div>
      ) : (
        items.map((item, i) => (
          <ul key={`encounterList-${i}`} css={utilities.list.items}>
            <ListSubheader
              title={item.month ? `${item.month} ${item.year}` : null}
            />
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
                    destinationUrl=""
                    primaryTime={startTimestamp
                      .getDate()
                      .toString()
                      .padStart(2, "0")}
                    secondaryTime={startTimestamp.toLocaleString("default", {
                      month: "short",
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
      {loadMore ? <LoadMoreButton handleClick={loadMore} /> : null}
    </div>
  );
};

export default EncounterList;
