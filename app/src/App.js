/** @jsx jsx */
import { jsx } from "@emotion/core";

import Layout from "./components/Layout";
import HabitatUseForm from "./components/HabitatUseForm";

import { usePosition } from "./location/usePosition";

const App = () => {
  const { lat, long, err } = usePosition();
  return (
    <Layout>
      <HabitatUseForm latitude={lat} longitude={long} error={err} />
    </Layout>
  );
};

export default App;
