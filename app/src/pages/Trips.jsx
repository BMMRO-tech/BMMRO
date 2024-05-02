/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Tabs from "../components/Tabs";
import { ROUTES } from "../constants/routes";
import { useContext } from "react";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import TripList from "../components/TripList";
import { useTripsByMonth } from "../hooks/useTripsByMonth";

const Trips = () => {
  const styles = {
    tabContainer: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    `,
    list: css`
      margin: 10px 10px 30px 10px;
    `,
  };

  const { datastore } = useContext(FirebaseContext);
  const { todaysTrips, previousTrips } = useTripsByMonth(datastore);

  return (
    <Layout hasDefaultPadding={false}>
      <div css={styles.tabContainer}>
        <Tabs />
        <Link to={ROUTES.newTrip}>
          <Button isSmall testId={"newTrips"}>
            + New
          </Button>
        </Link>
      </div>
      <div css={styles.list}>
        <TripList title="Today" trips={todaysTrips} isToday />
      </div>
      <div css={styles.list}>
        <TripList title="Previous encounters" trips={previousTrips} />
      </div>
    </Layout>
  );
};

export default Trips;
