/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment } from "react";
import ListSubheader from "./list/ListSubheader";
import ListItem from "./list/ListItem";
import utilities from "../materials/utilities";
import ListHeader from "./list/ListHeader";

const EncounterList = ({ title, items }) => {
  return (
    <Fragment>
      <ListHeader title={title} />
      <div css={utilities.list.container}>
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
      </div>
    </Fragment>
  );
};

export default EncounterList;
