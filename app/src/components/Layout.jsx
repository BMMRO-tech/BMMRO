/** @jsx jsx */
import { Fragment, useContext } from "react";
import { Global, css, jsx } from "@emotion/core";

import colors from "../materials/colors";
import { DatastoreContext } from "../App";
import Header from "./Header";
import Error from "./Error";

const Layout = ({ children }) => {
  const { error, datastore } = useContext(DatastoreContext);

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

    loadingIcon: css`
      height: 100px;
      fill: ${colors.lightBlue};
    `,
    loadingContainer: css`
      height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;

      animation-name: spin;
      animation-duration: 4000ms;
      animation-iteration-count: infinite;
      animation-timing-function: linear;

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(-360deg);
        }
      }
    `,
  };
  return (
    <Fragment>
      <Global styles={styles.global} />
      <Header />
      <main>
        <div css={styles.container}>
          {!datastore && !error ? (
            <span css={styles.loadingContainer} role="img" aria-label="loading">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 508.48 508.48"
                css={styles.loadingIcon}
              >
                <path d="M114.928 174.046l-28.8 28.8C114.48 109.944 212.776 57.617 305.677 85.969a175.873 175.873 0 0188.851 62.012l25.488-19.312C350.79 37.151 220.481 19.078 128.962 88.304A207.77 207.77 0 0052.64 203.998l-30.016-29.952L0 196.654l68.8 68.8 68.8-68.8-22.672-22.608zM439.68 242.702l-68.8 68.8 22.624 22.624 29.136-29.12c-28.103 93.051-126.317 145.702-219.368 117.599a176.002 176.002 0 01-91.912-65.599l-25.968 18.688a206.719 206.719 0 00135.248 83.824 211.742 211.742 0 0033.76 2.736c95.518-.045 178.669-65.284 201.44-158.048l29.952 29.92 22.688-22.624-68.8-68.8zm-.8 46.096l.816-.816 1.184 1.2-2-.384z" />
              </svg>
            </span>
          ) : !!error ? (
            <Error type={error} />
          ) : (
            children
          )}
        </div>
      </main>
    </Fragment>
  );
};

export default Layout;
