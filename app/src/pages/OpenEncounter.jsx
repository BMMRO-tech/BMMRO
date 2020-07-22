/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import Layout from "../components/Layout";
import EncounterOverview from "../components/EncounterOverview";
import HabitatUseList from "../components/HabitatUseList";
import Button from "../components/Button";

const OpenEncounter = () => {
  const encounter = {
    seqNo: "E12",
    area: "SA",
    species: "Bottlenose dolphin - coastal",
    habitatUseEntries: [
      {
        startTime: "09:45",
      },
      {
        startTime: "10:04",
      },
    ],
  };

  const styles = {
    container: css`
      margin-top: 20px;
    `,
    buttonContainer: css`
      display: flex;
      justify-content: center;
      margin-top: 20px;
    `,
  };

  return (
    <Layout>
      <div css={styles.container}>
        <EncounterOverview content={encounter} />
        <HabitatUseList items={encounter.habitatUseEntries} />
        <div css={styles.buttonContainer}>
          <Button>End Encounter</Button>
        </div>
      </div>
    </Layout>
  );
};

export default OpenEncounter;
