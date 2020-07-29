/** @jsx jsx */
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";

const NewHabitatUse = () => {
  return (
    <Layout hasDefaultPadding={false}>
      <HabitatUseForm />
    </Layout>
  );
};

export default NewHabitatUse;
