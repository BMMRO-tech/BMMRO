/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import { ROUTES } from "../constants/routes";
import { useLocation } from "@reach/router";

const Tabs = () => {
  const { pathname } = useLocation();

  const styles = {
    tabs: css`
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
    `,
    activeTab: css`
      background: white;
      padding: 10px 10px;
      color: black;
    `,
    tab: css`
      padding: 10px 10px;
      color: black;
      font-weight: 100;
    `,
  };

  return (
    <nav css={styles.tabs}>
      <Link to={ROUTES.trips}>
        <h2
          role="tab"
          testId={"navigateToTrips"}
          css={ROUTES.trips === pathname ? styles.activeTab : styles.tab}
        >
          TRIPS
        </h2>
      </Link>

      <Link to={ROUTES.encounters}>
        <h2
          role="tab"
          testId={"navigateToEncounters"}
          css={ROUTES.encounters === pathname ? styles.activeTab : styles.tab}
        >
          ENCOUNTERS
        </h2>
      </Link>
    </nav>
  );
};

export default Tabs;
