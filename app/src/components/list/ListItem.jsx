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
  primaryContentLeft,
  primaryContentRight,
  secondaryTime,
  secondaryContent,
}) => {
  const styles = {
    container: css`
      ${typography.mediumText}
      padding: 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid ${colors.lightGray};

      svg {
        height: 25px;
        margin-left: auto;
        fill: ${colors.mediumGray};
      }
    `,
    leftContainer: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
    `,
    contentContainer: css`
      display: flex;
      flex-direction: column;

      @media (min-width: ${breakPoints.maxPhone}) {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
      }
    `,
    mainContainer: css`
      display: flex;
      flex-direction: column;
      width: 100%;
      justify-content: left;

      @media (min-width: ${breakPoints.maxPhone}) {
        flex-direction: row;
        align-self: center;
      }
    `,
    primaryContentLeft: css`
      text-overflow: ellipsis;
      overflow: hidden;
      width: 50px;
      justify-content: left;
    `,
    primaryContentRight: css`
      padding-left: 0;

      @media (min-width: ${breakPoints.maxPhone}) {
        padding-left: 20px;
      }
    `,
    rightContainer: css`
      justify-content: flex-end;

      @media (min-width: ${breakPoints.maxPhone}) {
        text-align: right;
        padding-right: 10px;
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
        <div css={styles.leftContainer}>
          <span>{primaryTime}</span>
          {secondaryTime && <span>{secondaryTime}</span>}
        </div>

        <div css={styles.contentContainer}>
          <div css={styles.mainContainer}>
            {primaryContentLeft && (
              <span css={styles.primaryContentLeft}>{primaryContentLeft}</span>
            )}
            {primaryContentRight && (
              <span css={styles.primaryContentRight}>
                {primaryContentRight}
              </span>
            )}
          </div>

          <div css={styles.rightContainer}>
            {secondaryContent && (
              <span css={typography.smallText}>{secondaryContent}</span>
            )}
          </div>
        </div>

        <RightArrow />
      </li>
    </Link>
  );
};

export default ListItem;
