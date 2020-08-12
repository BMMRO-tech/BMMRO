/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";

import colors from "../../materials/colors";
import typography from "../../materials/typography";
import { RightArrow } from "../icons/RightArrow";

const ListItem = ({
  destinationUrl,
  primaryTimeInfo,
  primaryContentInfo,
  secondaryTimeInfo,
  secondaryContentInfo,
}) => {
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
    <Link css={styles.link} to={destinationUrl}>
      <li css={styles.container}>
        <span css={styles.time}>{primaryTimeInfo}</span>
        <span>{primaryContentInfo}</span>
        <RightArrow />
      </li>
    </Link>
  );
};

export default ListItem;
