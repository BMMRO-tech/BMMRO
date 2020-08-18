/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import containers from "../materials/containers";

const logoStyles = {
  loginLogo: css`
    display: block;
    margin-bottom: 40px;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  `,
};

const Login = () => {
  return (
    <Layout
      containerSize={containers.small}
      hasHeader={false}
      hasStickyButton={false}
    >
      <img
        css={logoStyles.loginLogo}
        src={process.env.PUBLIC_URL + "/logo512.png"}
        alt="BMMRO logo"
      />
      <LoginForm />
    </Layout>
  );
};

export default Login;
