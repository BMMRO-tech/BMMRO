/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";
import { Link } from "@reach/router";

import colors from "../materials/colors";
import typography from "../materials/typography";
import {
  generateNewHabitatUseURL,
  generateEditHabitatURL,
} from "../constants/routes";
import { RightArrow } from "./icons/RightArrow";
import ListHeader from "./list/ListHeader";
import Button from "../components/Button";

const HabitatUseListItem = ({ content, encounterId }) => {
  const styles = {
    container: css`
      ${typography.text}
      padding: 20px 0px;
      border-bottom: 1px solid ${colors.lightGray};
      display: flex;
      align-items: center;
    `,
    time: css`
      margin: 0px 20px;
    `,
    link: css`
      text-decoration: none;
      margin-left: auto;
    `,
  };
  return (
    <Link
      css={styles.link}
      to={generateEditHabitatURL(encounterId, content.id)}
    >
      <li css={styles.container} data-testid="habitat-use-list-item">
        <span css={styles.time}>{content.data.startTime}</span>
        <span>Habitat Use</span>
        <RightArrow />
      </li>
    </Link>
  );
};

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
              <HabitatUseListItem
                key={`habitatUseListItem-${item.id}`}
                content={item}
                encounterId={encounterId}
              />
            ))}
          </ul>
        )}
      </div>
    </Fragment>
  );
};

export default HabitatUseList;
