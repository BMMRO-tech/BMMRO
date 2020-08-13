/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";

import ListHeader from "./list/ListHeader";
import ListItem from "./list/ListItem";

const EncounterList = ({ title, items }) => {
  const styles = {
    list: css`
      list-style-type: none;
      padding: 0;
      margin: 0;
    `,
    listContainer: css`
      background: white;
    `,
    noEntries: css`
      padding: 20px;
      font-style: italic;
    `,
    link: css`
      text-decoration: none;
      margin-left: auto;
      min-height: 44px;
    `,
  };

  const sortedItems = items.sort((a, b) =>
    b.data.startTime.localeCompare(a.data.startTime)
  );

  return (
    <Fragment>
      <ListHeader title={title} />
      <div css={styles.listContainer}>
        {sortedItems.length === 0 ? (
          <div css={styles.noEntries}>No encounters yet</div>
        ) : (
          <ul css={styles.list}>
            {sortedItems.map((item) => (
              <ListItem
                key={item.id}
                destinationUrl=""
                primaryTime="01"
                secondaryTime="Aug"
                primaryContent="S02 Sperm Whale"
                secondaryContent="North Grand Bahama"
              />
            ))}
          </ul>
        )}
      </div>
    </Fragment>
  );
};

export default EncounterList;
