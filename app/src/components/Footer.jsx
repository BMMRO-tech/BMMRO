/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import breakPoints from "../materials/breakPoints";
import containers from "../materials/containers";
import colors from "../materials/colors";
import Logo from "./icons/Logo";

const Footer = ({ hasStickyButton = false }) => {
  const styles = {
    footer: css`
      min-height: 50px;
      box-shadow: 0 -5px 5px -5px rgba(40, 54, 104, 0.15);
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      margin-bottom: ${hasStickyButton ? "64px" : "0"};

      @media (min-width: ${breakPoints.mediumTablet}) {
        margin-bottom: 0;
      }
    `,
    container: css`
      display: flex;
      align-items: center;
      max-width: ${containers.default};
      margin: 0 auto;
      padding: 10px;
    `,
    text: css`
      font-size: 14px;
      margin-left: 10px;
      color: ${colors.darkGray};
    `,
  };

  const renderVersionNumber = () => {
    const version = process.env.REACT_APP_VERSION;
    return version ? <p css={styles.text}>Version {version}</p> : "";
  };

  return (
    <footer css={styles.footer}>
      <div css={styles.container}>
        <Logo />
        {renderVersionNumber()}
      </div>
    </footer>
  );
};

export default Footer;
