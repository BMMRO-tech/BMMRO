/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext } from "react";
import { navigate } from "@reach/router";

import Layout from "../components/Layout";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { generateNewLogbookEntryURL } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";
import utilities from "../materials/utilities";
import NewTripForm from "../components/NewTripForm";
const NewTrip = () => {
  const { datastore } = useContext(FirebaseContext);
  const handleSubmit = (values) => {
    const id = datastore.createDoc(CollectionNames.TRIP, values);
    navigate(generateNewLogbookEntryURL(id));
  };

  return (
    <Layout hasDefaultPadding={false}>
      <h1 css={utilities.form.title}>New Trip</h1>
      <NewTripForm handleSubmit={handleSubmit} datastore={datastore} />
    </Layout>
  );
};

export default NewTrip;
