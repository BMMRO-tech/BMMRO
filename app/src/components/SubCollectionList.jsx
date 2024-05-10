/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Link } from "@reach/router";

import utilities from "../materials/utilities";
import {
  generateEditHabitatURL,
  generateViewHabitatURL,
  generateEditBiopsyURL,
  generateViewBiopsyURL,
  generateEditLogbookEntryURL,
  generateViewLogbookEntryURL,
  generateNewBiopsyURL,
} from "../constants/routes";
import ListHeader from "./list/ListHeader";
import Button from "./Button";
import ListItem from "./list/ListItem";

const TYPES = {
  habitat: {
    title: "Habitat Use",
    primaryTime: "startTime",
    buttonTestId: "newHabitat",
    destinationUrl: (parentId, item) => {
      return item.data.exported
        ? generateViewHabitatURL(parentId, item.id)
        : generateEditHabitatURL(parentId, item.id);
    },
  },
  biopsy: {
    title: "Biopsy",
    primaryTime: "timeTaken",
    buttonTestId: "newBiopsy",
    destinationUrl: (parentId, item) => {
      return item.data.exported
        ? generateViewBiopsyURL(parentId, item.id)
        : generateEditBiopsyURL(parentId, item.id);
    },
  },
  logbook: {
    title: "Logbook",
    primaryTime: "time",
    buttonTestId: "newLogbook",
    destinationUrl: (parentId, item) => {
      return item.data.exported
        ? generateViewLogbookEntryURL(parentId, item.id)
        : generateEditLogbookEntryURL(parentId, item.id);
    },
  },
};

const SubCollectionList = ({
  items,
  parentId,
  isExported = false,
  newUrl = generateNewBiopsyURL(parentId),
  type = "biopsy",
}) => {
  const currentType = TYPES[type];

  const sortedItems = () => {
    const sortedBy = currentType.primaryTime;

    return items.sort((a, b) =>
      b.data[sortedBy].localeCompare(a.data[sortedBy])
    );
  };

  return (
    <div css={utilities.list.container}>
      <ListHeader title={currentType.title}>
        {!isExported && (
          <Link to={newUrl}>
            <Button isSmall testId={currentType.buttonTestId}>
              + New
            </Button>
          </Link>
        )}
      </ListHeader>
      {sortedItems().length === 0 ? (
        <p css={utilities.list.noEntries}>
          No {currentType.title.toLowerCase()} entries yet
        </p>
      ) : (
        <ul css={utilities.list.items}>
          {sortedItems().map((item) => (
            <ListItem
              key={item.id}
              destinationUrl={currentType.destinationUrl(parentId, item)}
              primaryTime={item.data[currentType.primaryTime]}
              primaryContentRight={currentType.title}
              isHabitatUse={type === "habitat"}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubCollectionList;
