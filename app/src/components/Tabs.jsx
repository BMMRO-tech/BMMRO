/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link, useLocation } from "@reach/router";
import { ROUTES } from "../constants/routes";
import Button from "./Button";
import colors from "../materials/colors";

const Tabs = () => {
  const { pathname } = useLocation();

  const styles = {
    tabContainer: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    `,

    tabs: css`
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
    `,

    activeTab: css`
      background: ${colors.mediumTurquoise};
      padding: 10px 10px;
      color: ${colors.white};
      border: 0px;
      font-weight: bold;
      font-size: 18px;
    `,
    tab: css`
      padding: 10px 10px;
      color: black;
      background: transparent;
      border: 0px;
      font-size: 18px;
    `,
  };

  const Tab = ({ title }) => {
    return (
      <Link to={ROUTES[title]}>
        <Button
          role="tab"
          testId={`${title}Tab`}
          customCss={
            pathname.startsWith(ROUTES[title]) ? styles.activeTab : styles.tab
          }
        >
          {title.toUpperCase()}
        </Button>
      </Link>
    );
  };

  const NewButton = ({ title }) => {
    return (
      <Link to={`${ROUTES[title]}/new`}>
        <Button isSmall testId={`new-${title}-button`}>
          + New
        </Button>
      </Link>
    );
  };

  return (
    <div css={styles.tabContainer}>
      <nav css={styles.tabs}>
        {Tab({ title: "trips" })}
        {Tab({ title: "encounters" })}
      </nav>
      {pathname === "/encounters" && NewButton({ title: "encounters" })}
      {pathname === "/trips" && NewButton({ title: "trips" })}
    </div>
  );
};

export default Tabs;
