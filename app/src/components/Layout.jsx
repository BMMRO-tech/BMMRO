/** @jsx jsx */
import { Fragment } from "react";
import { Global, css, jsx } from "@emotion/core";

import colors from "../materials/colors";

const Layout = ({ children }) => {
  const styles = {
    global: css`
      body {
        margin: 0;
        font-family: Verdana, Geneva, sans-serif;
        background-color: ${colors.lightBlue};
      }
    `,
    main: css`
      padding: 20px;
    `,
  };
  return (
    <Fragment>
      <Global styles={styles.global} />
      <main css={styles.main}>{children}</main>
    </Fragment>
  );
};

export default Layout;
