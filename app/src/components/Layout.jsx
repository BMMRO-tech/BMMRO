/** @jsx jsx */
import { Fragment } from "react";
import { Global, css, jsx } from "@emotion/core";

import colors from "../materials/colors";
import Header from "./Header";

const Layout = ({ children }) => {
  const styles = {
    global: css`
      body {
        margin: 0;
        font-family: Verdana, Geneva, sans-serif;
        background-color: ${colors.white};
        color: ${colors.darkBlue};
      }
      * {
        box-sizing: border-box;
      }
    `,
    container: css`
      max-width: 740px;
      margin: 0 auto;
      padding: 10px;
    `,
  };
  return (
    <Fragment>
      <Global styles={styles.global} />
      <Header />
      <main>
        <div css={styles.container}>{children}</div>
      </main>
    </Fragment>
  );
};

export default Layout;
