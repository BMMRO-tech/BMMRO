/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import { ROUTES } from "../constants/routes";
import colors from "../materials/colors";
import Layout from "../components/Layout";
import Button from "../components/Button";

const styles = {
  container: css`
    background-color: ${colors.lightGray};
    padding: 10px;
  `,
};

const OpenEncounter = () => {
  const encounterData = {
    seqNo: "E12",
    area: "SA",
    species: "Bottlenose dolphin - coastal",
  };

  return (
    <Layout>
      <div css={styles.container}>
        <div>Encounter {encounterData.seqNo}</div>
        <div>{encounterData.species} species</div>
        <div>{encounterData.area}</div>
        <Link to={ROUTES.habitat}>
          <Button variant="secondary">+ Add Habitat Use</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default OpenEncounter;
