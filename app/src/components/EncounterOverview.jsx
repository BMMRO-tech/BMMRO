/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";

import { ROUTES } from "../constants/routes";
import typography from "../materials/typography";
import colors from "../materials/colors";
import Button from "../components/Button";

const EncounterOverview = ({ encounter }) => {
  const styles = {
    container: css`
      background-color: ${colors.lighterGray};
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
    link: css`
      text-decoration: none;
    `,
  };

  return (
    <div css={styles.container}>
      <div css={styles.summaryContainer}>
        <h1 css={typography.title}>
          <span css={[typography.caption, styles.caption]}>
            Encounter {encounter.sequenceNumber}
          </span>
          <span css={styles.title}>{encounter.species} species</span>
        </h1>
        <h2 css={typography.text}>{encounter.area}</h2>
      </div>
      <Link css={styles.link} to={ROUTES.newHabitatUse}>
        <Button variant="secondary">+ Add Habitat Use</Button>
      </Link>
    </div>
  );
};

export default EncounterOverview;
