/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Link } from "@reach/router";

import utilities from "../materials/utilities";
import {
  generateEditHabitatURL,
  generateViewHabitatURL,
  generateEditBiopsyURL,
  generateViewBiopsyURL,
  generateNewBiopsyURL,
} from "../constants/routes";
import ListHeader from "./list/ListHeader";
import Button from "./Button";
import ListItem from "./list/ListItem";
import { useMemo } from "react";

const COLLECTIONS = {
  habitat: {
    title: "Habitat Use",
    primaryTime: "startTime",
    buttonTestId: "newHabitat",
    primaryContentRight: () => "Habitat Use",
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
    primaryContentRight: () => "Biopsy",
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
    primaryContentRight: (totalItems, index) =>
      `Logbook entry ${totalItems - index}`,
    // TODO: make link clickable once view and edit logbook functionality is there
    destinationUrl: (parentId, item) => "",
    // {
    //   return item.data.exported
    //     ? generateViewLogbookEntryURL(parentId, item.id)
    //     : generateEditLogbookEntryURL(parentId, item.id);
    // },
  },
};

const SubCollectionList = ({
  items,
  parentId,
  isExported = false,
  newUrl = generateNewBiopsyURL(parentId),
  type = "biopsy",
  hasEnded = false,
}) => {
  const collection = COLLECTIONS[type];

  const list = useMemo(() => {
    const sortedBy = collection.primaryTime;

    return items.sort((a, b) =>
      b.data[sortedBy].localeCompare(a.data[sortedBy])
    );
  }, [collection, items]);

  return (
    <div css={utilities.list.container}>
      <ListHeader title={collection.title}>
        {!isExported && (
          <Link to={newUrl}>
            <Button isSmall testId={collection.buttonTestId}>
              + New
            </Button>
          </Link>
        )}
      </ListHeader>
      {list.length === 0 ? (
        <p css={utilities.list.noEntries}>
          No {collection.title.toLowerCase()} entries yet
        </p>
      ) : (
        <ul css={utilities.list.items}>
          {list.map((item, index) => (
            <ListItem
              key={item.id}
              destinationUrl={collection.destinationUrl(parentId, item)}
              primaryTime={item.data[collection.primaryTime]}
              primaryContentRight={collection.primaryContentRight(
                list.length,
                index
              )}
              isHabitatUse={type === "habitat"}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubCollectionList;
