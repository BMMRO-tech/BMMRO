/** @jsx jsx */
import { Fragment, useContext } from "react";
import { Global, css, jsx } from "@emotion/core";
import containers from "../materials/containers";
import colors from "../materials/colors";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Header from "./Header";
import Error from "./Error";
import Loader from "./Loader";

const Layout = ({
  containerSize = containers.default,
  hasDefaultPadding = true,
  children,
  hasHeader = true,
}) => {
  const { datastore, datastoreError } = useContext(FirebaseContext);

  const styles = {
    global: css`
      body {
        margin: 0;
        background-color: ${colors.white};
        color: ${colors.darkGray};
        font-size: 16px;
      }
      * {
        box-sizing: border-box;
        font-family: "Open Sans", Verdana, sans-serif;
      }
    `,
    container: css`
      max-width: ${containerSize};
      padding-top: 25px;
      padding-left: ${hasDefaultPadding ? "10px" : 0};
      padding-right: ${hasDefaultPadding ? "10px" : 0};
      margin: 0 auto;
    `,
  };

  return (
    <Fragment>
      <Global styles={styles.global} />
      {hasHeader ? <Header /> : null}
      <main>
        <div css={styles.container}>
          {!datastore && !datastoreError ? (
            <Loader />
          ) : !!datastoreError ? (
            <Error type={datastoreError} />
          ) : (
            children
          )}
        </div>
      </main>
    </Fragment>
  );
};

export default Layout;
