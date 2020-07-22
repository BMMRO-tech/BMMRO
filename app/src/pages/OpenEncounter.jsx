/** @jsx jsx */
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import EncounterOverview from "../components/EncounterOverview";

const OpenEncounter = () => {
  const encounterData = {
    seqNo: "E12",
    area: "SA",
    species: "Bottlenose dolphin - coastal",
  };

  return (
    <Layout>
      <EncounterOverview content={encounterData} />
    </Layout>
  );
};

export default OpenEncounter;
