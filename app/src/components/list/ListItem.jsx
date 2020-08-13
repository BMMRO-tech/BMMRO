/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";

import colors from "../../materials/colors";
import typography from "../../materials/typography";
import breakPoints from "../../materials/breakPoints";
import { RightArrow } from "../icons/RightArrow";

const ListItem = ({
  destinationUrl,
  primaryTime,
  primaryContent,
  secondaryTime,
  secondaryContent,
}) => {
  const styles = {
    container: css`
      ${typography.mediumText}
      padding: 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid ${colors.lightGray};
    `,
    timeContainer: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
    `,
    contentContainer: css`
      display: flex;
      flex-direction: column;
      width: 100%;

      @media (min-width: ${breakPoints.mediumTablet}) {
        flex-direction: row;
        justify-content: space-between;
        margin-right: 20px;
      }
    `,
    link: css`
      text-decoration: none;
      margin-left: auto;
    `,
  };
  return (
    <Link css={styles.link} to={destinationUrl}>
      <li css={styles.container}>
        <div css={styles.timeContainer}>
          <span>{primaryTime}</span>
          {secondaryTime && <span>{secondaryTime}</span>}
        </div>

        <div css={styles.contentContainer}>
          <span>{primaryContent}</span>
          {secondaryContent && (
            <span css={typography.smallText}>{secondaryContent}</span>
          )}
        </div>
        <RightArrow />
      </li>
    </Link>
  );
};

export default ListItem;
