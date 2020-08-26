/** @jsx jsx */
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import containers from "../materials/containers";
import BMMROLogo from "../components/icons/BMMROLogo";

const Login = () => {
  return (
    <Layout
      containerSize={containers.small}
      hasHeader={false}
      hasStickyButton={false}
    >
      <BMMROLogo loginPage />
      <LoginForm />
    </Layout>
  );
};

export default Login;
