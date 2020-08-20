/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";
import { Link } from "@reach/router";

import typography from "../materials/typography";
import colors from "../materials/colors";
import { RightArrow } from "./icons/RightArrow";
import { generateEditEncounterURL } from "../constants/routes";

const EncounterOverview = ({ encounter, isNewEncounter }) => {
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
      display: flex;
    `,
    arrow: css`
      margin-left: 5px;
      display: flex;
      align-items: center;

      svg {
        height: 15px;
        fill: ${colors.darkTurquoise};
        stroke: ${colors.darkTurquoise};
        stroke-width: 2;
      }
    `,
  };

  return (
    <div css={styles.container}>
      <div css={styles.summaryContainer}>
        {isNewEncounter ? (
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
        <span>Encounter data sheet</span>
        <span css={styles.arrow}>
          <RightArrow />
        </span>
      </Link>
    </div>
  );
};

export default EncounterOverview;
