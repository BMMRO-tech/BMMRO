/** @jsx jsx */
import { Fragment } from "react";
import { Global, css, jsx } from "@emotion/core";

import colors from "../materials/colors";
import Header from "./Header";
import { useContext } from "react";
import { DatastoreContext } from "../App";
import Error from "../pages/Error";

const Layout = ({ children }) => {
  const { error } = useContext(DatastoreContext);

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
        <div css={styles.container}>
          {!!error ? <Error type={error} /> : children}
        </div>
      </main>
    </Fragment>
  );
};

export default Layout;
