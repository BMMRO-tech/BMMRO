/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import { ROUTES } from "../constants/routes";
import { useLocation } from "@reach/router";
import Button from "./Button";

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
          customCss={ROUTES[title] === pathname ? styles.activeTab : styles.tab}
        >
          {title.toUpperCase()}
        </Button>
      </Link>
    );
  };

  return (
    <nav css={styles.tabs}>
      {Tab({ title: "trips" })}
      {Tab({ title: "encounters" })}
    </nav>
  );
};

export default Tabs;
