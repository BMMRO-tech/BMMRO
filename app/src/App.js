/** @jsx jsx */
import { jsx } from "@emotion/core";

import Layout from "./components/Layout";
import HabitatUseForm from "./components/HabitatUseForm";

const App = () => {
  return (
    <Layout>
      <h1>Hello BMMRO</h1>
      <HabitatUseForm />
    </Layout>
  );
};

export default App;
