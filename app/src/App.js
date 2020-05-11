/** @jsx jsx */
import { jsx } from "@emotion/core";

import Layout from "./components/Layout";
import HabitatUseForm from "./components/HabitatUseForm";

const App = () => {
  return (
    <Layout>
      <HabitatUseForm />
    </Layout>
  );
};

export default App;
