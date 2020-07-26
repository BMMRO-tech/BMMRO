/** @jsx jsx */
import { jsx } from "@emotion/core";
import containers from "../materials/containers";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import Logo from "../components/icons/Logo";

const Login = () => {
  return (
    <Layout containerSize={containers.small} hasHeader={false}>
      <Logo isLoginPage={true} />
      <LoginForm />
    </Layout>
  );
};

export default Login;
