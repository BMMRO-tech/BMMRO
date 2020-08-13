/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import colors from "../materials/colors";
import typography from "../materials/typography";
import utilities from "../materials/utilities";
import ListItem from "./list/ListItem";

const EncounterList = ({ items }) => {
  const styles = {
    section: css`
      background-color: ${colors.lightestTurquoise};
      ${typography.mediumText}
      padding-left: 10px;
    `,
  };

  const sortedItems = !!items.entries.length
    ? items.entries.sort(
        (a, b) => b.data.startTimestamp - a.data.startTimestamp
      )
    : [];

  return (
    <ul css={utilities.list.items}>
      {!!items.sectionTitle && (
        <div css={styles.section}>{items.sectionTitle}</div>
      )}
      {!sortedItems.length ? (
        <div css={utilities.list.noEntries}>No encounters yet</div>
      ) : (
        sortedItems.map((entry) => {
          const { startTimestamp, sequenceNumber, species, area } = entry.data;

          return (
            <ListItem
              key={entry.id}
              destinationUrl=""
              primaryTime={startTimestamp.getDate().toString().padStart(2, "0")}
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
  );
};

export default EncounterList;
