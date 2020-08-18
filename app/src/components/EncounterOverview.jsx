/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";
import { Link } from "@reach/router";

import typography from "../materials/typography";
import colors from "../materials/colors";
import { RightArrow } from "./icons/RightArrow";
import { generateEditEncounterURL } from "../constants/routes";

const EncounterOverview = ({ encounter }) => {
  const styles = {
    container: css`
      background-color: ${colors.white};
      padding: 15px 10px;
    `,
    summaryContainer: css`
      margin-bottom: 15px;
    `,
    caption: css`
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    title: css`
      color: ${colors.darkTurquoise};
      display: block;
    `,
    subTitle: css`
      ${typography.largeText}
      font-weight: 500;
    `,
    link: css`
      ${typography.largeText}
      font-weight: 600;
      color: ${colors.darkTurquoise};
      padding-top: 10px;

      display: flex;
      align-items: center;
    `,
    arrow: css`
      svg {
        alignment-baseline: bottom;
        height: 16px;
        margin-left: 5px;
        fill: ${colors.darkTurquoise};
      }
    `,
  };

  const isNewEncounter = () => {
    return !encounter.sequenceNumber || !encounter.species || !encounter.area;
  };

  return (
    <div css={styles.container}>
      <div css={styles.summaryContainer}>
        {isNewEncounter() ? (
          <h1 css={typography.title}>New encounter</h1>
        ) : (
          <Fragment>
            <h1 css={typography.title}>
              <span css={[typography.caption, styles.caption]}>
                Encounter {encounter.sequenceNumber}
              </span>
              <span css={styles.title}>{encounter.species}</span>
            </h1>
            <h2 css={styles.subTitle}>{encounter.area}</h2>
          </Fragment>
        )}
      </div>
      <Link css={styles.link} to={generateEditEncounterURL(encounter.id)}>
        <div>Encounter data sheet </div>
        <div css={styles.arrow}>
          <RightArrow />
        </div>
      </Link>
    </div>
  );
};

export default EncounterOverview;
