/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment } from "react";
import { Link } from "@reach/router";

import utilities from "../materials/utilities";
import {
  generateNewHabitatUseURL,
  generateEditHabitatURL,
} from "../constants/routes";
import ListHeader from "./list/ListHeader";
import Button from "../components/Button";
import ListItem from "./list/ListItem";

const HabitatUseList = ({ items, encounterId }) => {
  const sortedItems = items.sort((a, b) =>
    b.data.startTime.localeCompare(a.data.startTime)
  );

  return (
    <Fragment>
      <ListHeader title="Habitat Use">
        <Link
          css={utilities.list.link}
          to={generateNewHabitatUseURL(encounterId)}
        >
          <Button>+ New</Button>
        </Link>
      </ListHeader>
      <div css={utilities.list.container}>
        {sortedItems.length === 0 ? (
          <p css={utilities.list.noEntries}>No habitat use entries yet</p>
        ) : (
          <ul css={utilities.list.items}>
            {sortedItems.map((item) => (
              <ListItem
                key={item.id}
                destinationUrl={generateEditHabitatURL(encounterId, item.id)}
                primaryTime={item.data.startTime}
                primaryContent="Habitat Use"
              />
            ))}
          </ul>
        )}
      </div>
    </Fragment>
  );
};

export default HabitatUseList;
