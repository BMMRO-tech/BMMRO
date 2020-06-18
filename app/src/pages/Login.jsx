/** @jsx jsx */
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";

const Login = () => {
  return (
    <Layout hasHeader={false}>
      <Logo loginPage={true} />
      <LoginForm />
    </Layout>
  );
};

export default Login;
