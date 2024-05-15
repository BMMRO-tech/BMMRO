/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";

import colors from "../../materials/colors";
import typography from "../../materials/typography";
import breakPoints from "../../materials/breakPoints";
import { RightArrow } from "../icons/RightArrow";
import Button from "../Button";

const ListItem = ({
  destinationUrl,
  primaryTime,
  secondaryTime,
  primaryContentLeft,
  primaryContentLeftStyle,
  primaryContentRight,
  secondaryContent,
  isHabitatUse,
  middleContent,
}) => {
  const styles = {
    link: css`
      text-decoration: none;
    `,
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
      min-width: 50px;
      margin-right: 20px;
    `,
    detailsContainer: css`
      width: 100%;
      display: flex;
      flex-direction: column;

      @media (min-width: ${breakPoints.maxPhone}) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-right: 10px;
      }
    `,
    centralContainer: css`
      display: flex;
      flex-direction: column;

      @media (min-width: ${breakPoints.maxPhone}) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    `,
    primaryContentLeft: css`
      width: 50px;
      min-width: 50px;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-right: 10px;
    `,

    middleContentStyle: css`
      background: ${colors.mediumTurquoise};
      color: ${colors.white};
      border: 1px solid ${colors.mediumTurquoise};
      margin-left: 20px;
    `,

    rightContainer: css`
      ${typography.smallText}

      @media (min-width: ${breakPoints.maxPhone}) {
        text-align: right;
      }
    `,
  };
  return (
    <Link
      css={styles.link}
      to={destinationUrl}
      id={isHabitatUse ? "habitatUse" : "biopsy"}
    >
      <li css={styles.container}>
        {primaryTime && (
          <div css={styles.leftContainer}>
            <span>{primaryTime}</span>
            {secondaryTime && <span>{secondaryTime}</span>}
          </div>
        )}

        <div css={styles.detailsContainer}>
          <div css={styles.centralContainer}>
            {primaryContentLeft && (
              <span css={styles.primaryContentLeft && primaryContentLeftStyle}>
                {primaryContentLeft}
              </span>
            )}
            {primaryContentRight && <span>{primaryContentRight}</span>}
            {middleContent && (
              <span css={styles.middleContentStyle}>
                <Button isSmall variant="primary">
                  {middleContent}
                </Button>
              </span>
            )}
          </div>

          {secondaryContent && (
            <span css={styles.rightContainer}>{secondaryContent}</span>
          )}
        </div>
        <RightArrow />
      </li>
    </Link>
  );
};

export default ListItem;
