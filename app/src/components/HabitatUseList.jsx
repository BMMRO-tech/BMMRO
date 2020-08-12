/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";
import { Link } from "@reach/router";

import {
  generateNewHabitatUseURL,
  generateEditHabitatURL,
} from "../constants/routes";
import ListHeader from "./list/ListHeader";
import Button from "../components/Button";
import ListItem from "./list/ListItem";

const HabitatUseList = ({ items, encounterId }) => {
  const styles = {
    list: css`
      list-style-type: none;
      padding: 0;
      margin: 0;
    `,
    listContainer: css`
      min-height: 100px;
      background: white;
    `,
    noEntries: css`
      margin: 20px 20px;
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
      <ListHeader title="Habitat Use">
        <Link css={styles.link} to={generateNewHabitatUseURL(encounterId)}>
          <Button>+ New</Button>
        </Link>
      </ListHeader>
      <div css={styles.listContainer}>
        {sortedItems.length === 0 ? (
          <p css={styles.noEntries}>No habitat use entries yet</p>
        ) : (
          <ul css={styles.list}>
            {sortedItems.map((item) => (
              <ListItem
                key={`habitatUseListItem-${item.id}`}
                destinationUrl={generateEditHabitatURL(encounterId, item.id)}
                primaryTimeInfo={item.data.startTime}
                primaryContentInfo="Habitat Use"
              />
            ))}
          </ul>
        )}
      </div>
    </Fragment>
  );
};

export default HabitatUseList;
