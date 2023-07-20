/** @jsxImportSource @emotion/react */
import { Fragment, useContext } from "react";
import { Global, css, jsx } from "@emotion/react";

import containers from "../materials/containers";
import breakPoints from "../materials/breakPoints";
import colors from "../materials/colors";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Header from "./Header";
import Error from "./Error";
import Loader from "./Loader";
import Footer from "./Footer";

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
        margin: 65px 0 150px 0;
        background-color: ${colors.lighterGray};
        color: ${colors.darkGray};
        font-size: 16px;

        @media (min-width: ${breakPoints.mediumTablet}) {
          margin-bottom: 100px;
        }
      }

      html {
        position: relative;
        min-height: 100%;
      }

      a {
        text-decoration: none;
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
      <Footer />
    </Fragment>
  );
};

export default Layout;
