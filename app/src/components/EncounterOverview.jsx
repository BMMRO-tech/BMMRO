/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";

import { ROUTES } from "../constants/routes";
import typography from "../materials/typography";
import colors from "../materials/colors";
import Button from "../components/Button";

const EncounterOverview = ({ content }) => {
  const styles = {
    container: css`
      background-color: ${colors.lightGray};
      padding: 10px;
    `,
    summaryContainer: css`
      margin-bottom: 15px;
    `,
    title: css`
      display: block;
      margin: 5px 0;
    `,
  };

  return (
    <div css={styles.container}>
      <div css={styles.summaryContainer}>
        <h1 css={typography.title}>
          <span css={typography.caption}>Encounter {content.seqNo}</span>
          <span css={styles.title}>{content.species} species</span>
        </h1>
        <h2 css={typography.subtitle}>{content.area}</h2>
      </div>
      <Link to={ROUTES.habitat}>
        <Button variant="secondary">+ Add Habitat Use</Button>
      </Link>
    </div>
  );
};

export default EncounterOverview;
