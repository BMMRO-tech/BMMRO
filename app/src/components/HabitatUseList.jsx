/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Link } from "@reach/router";

import utilities from "../materials/utilities";
import {
  generateNewHabitatUseURL,
  generateEditHabitatURL,
  generateViewHabitatURL,
} from "../constants/routes";
import ListHeader from "./list/ListHeader";
import Button from "../components/Button";
import ListItem from "./list/ListItem";

const HabitatUseList = ({ items, encounterId, encounterExported = false }) => {
  const sortedItems = items.sort((a, b) =>
    b.data.startTime.localeCompare(a.data.startTime)
  );

  return (
    <div css={utilities.list.container}>
      <ListHeader title="Habitat Use">
        {!encounterExported && (
          <Link to={generateNewHabitatUseURL(encounterId)}>
            <Button isSmall>+ New</Button>
          </Link>
        )}
      </ListHeader>
      {sortedItems.length === 0 ? (
        <p css={utilities.list.noEntries}>No habitat use entries yet</p>
      ) : (
        <ul css={utilities.list.items}>
          {sortedItems.map((item) => (
            <ListItem
              key={item.id}
              destinationUrl={
                item.data.exported
                  ? generateViewHabitatURL(encounterId, item.id)
                  : generateEditHabitatURL(encounterId, item.id)
              }
              primaryTime={item.data.startTime}
              primaryContentRight="Habitat Use"
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default HabitatUseList;
