/** @jsx jsx */

import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";
import BackLink from "../components/BackLink";
import { ROUTES } from "../constants/routes";

const ViewTrip = ({ tripId }) => {
  return (
    <Layout hasDefaultPadding={false}>
      <div css={utilities.backLinkContainer.top}>
        <BackLink text="Return to trip overview" to={ROUTES.trips} />
      </div>
      <h1 css={utilities.form.title}>View Trip</h1>
      <p>Work in progress.</p>
    </Layout>
  );
};
export default ViewTrip;
