/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Layout from "../components/Layout";
import { useContext } from "react";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import TripList from "../components/TripList";
import { useTripsByMonth } from "../hooks/useTripsByMonth";

const Trips = () => {
  const styles = {
    list: css`
      margin: 10px 10px 30px 10px;
    `,
  };

  const { datastore } = useContext(FirebaseContext);
  const { todaysTrips, previousTrips } = useTripsByMonth(datastore);

  return (
    <Layout hasDefaultPadding={false}>
      <div css={styles.container}>
        <p>
          Work in progress. Please click on the "ENCOUNTERS" tab to use the app
          as usual.
        </p>
      </div>
      <div css={styles.list}>
        <TripList title="Current trips" trips={todaysTrips} isToday />
      </div>
      <div css={styles.list}>
        <TripList title="Previous trips" trips={previousTrips} />
      </div>
    </Layout>
  );
};

export default Trips;
