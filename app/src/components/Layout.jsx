/** @jsx jsx */
import { Fragment } from "react";
import { Global, css, jsx } from '@emotion/core'

const Layout = ({children}) => (
  <Fragment>
    <Global
      styles={css`
        body {
          margin: 0;
          font-family: Verdana, Geneva, sans-serif;
          background-color: lightblue;
        }
      `}
    />
    <main css={css`
      padding: 20px;
    `}>
      {children}
    </main>
  </Fragment>
);


export default Layout;