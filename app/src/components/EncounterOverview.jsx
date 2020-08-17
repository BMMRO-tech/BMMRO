/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import typography from "../materials/typography";
import colors from "../materials/colors";

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
      display: block;
    `,
    subTitle: css`
      ${typography.largeText}
      font-weight: 500;
    `,
  };

  return (
    <div css={styles.container}>
      <div css={styles.summaryContainer}>
        <h1 css={typography.title}>
          <span css={[typography.caption, styles.caption]}>
            Encounter {encounter.sequenceNumber}
          </span>
          <span css={styles.title}>{encounter.species}</span>
        </h1>
        <h2 css={styles.subTitle}>{encounter.area}</h2>
      </div>
    </div>
  );
};

export default EncounterOverview;
