/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Link } from "@reach/router";

import utilities from "../materials/utilities";
import {
  generateNewHabitatUseURL,
  generateEditHabitatURL,
  generateViewHabitatURL,
  generateNewBiopsyURL,
  generateEditBiopsyURL,
  generateViewBiopsyURL,
} from "../constants/routes";
import ListHeader from "./list/ListHeader";
import Button from "./Button";
import ListItem from "./list/ListItem";

const SubCollectionList = ({
  items,
  encounterId,
  encounterExported = false,
  isHabitatUse,
}) => {
  const sortedItems = () => {
    if (isHabitatUse) {
      return items.sort((a, b) =>
        b.data.startTime.localeCompare(a.data.startTime)
      );
    }
    return items.sort((a, b) =>
      b.data.timeTaken.localeCompare(a.data.timeTaken)
    );
  };

  const title = isHabitatUse ? "Habitat Use" : "Biopsy";
  const buttonTestId = isHabitatUse ? "newHabitat" : "newBiopsy";

  const getDestinationUrl = (isHabitatUse, item) => {
    if (isHabitatUse) {
      return item.data.exported
        ? generateViewHabitatURL(encounterId, item.id)
        : generateEditHabitatURL(encounterId, item.id);
    }

    return item.data.exported
      ? generateViewBiopsyURL(encounterId, item.id)
      : generateEditBiopsyURL(encounterId, item.id);
  };

  return (
    <div css={utilities.list.container}>
      <ListHeader title={title}>
        {!encounterExported && (
          <Link
            to={
              isHabitatUse
                ? generateNewHabitatUseURL(encounterId)
                : generateNewBiopsyURL(encounterId)
            }
          >
            <Button isSmall testId={buttonTestId}>
              + New
            </Button>
          </Link>
        )}
      </ListHeader>
      {sortedItems().length === 0 ? (
        <p css={utilities.list.noEntries}>
          No {title.toLowerCase()} entries yet
        </p>
      ) : (
        <ul css={utilities.list.items}>
          {sortedItems().map((item) => (
            <ListItem
              key={item.id}
              destinationUrl={getDestinationUrl(isHabitatUse, item)}
              primaryTime={
                isHabitatUse ? item.data.startTime : item.data.timeTaken
              }
              primaryContentRight={title}
              isHabitatUse={isHabitatUse}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubCollectionList;
