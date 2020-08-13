/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment } from "react";

import utilities from "../materials/utilities";
import ListHeader from "./list/ListHeader";
import EncounterList from "./EncounterList";

const EncounterListContainer = ({ title, items }) => {
  return (
    <Fragment>
      <ListHeader title={title} />
      <div css={utilities.list.container}>
        {items.length === 0 ? (
          <div css={utilities.list.noEntries}>No encounters yet</div>
        ) : (
          <div>
            {items.map((item, i) => (
              <EncounterList key={`encounterList-${i}`} items={item} />
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default EncounterListContainer;
