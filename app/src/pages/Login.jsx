/** @jsx jsx */
import { useState, useContext } from "react";
import { jsx } from "@emotion/core";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import firebaseApp from "../firebaseContext/firebase";
import Layout from "../components/Layout";
import { navigate } from "@reach/router";
import { useLoginRedirect } from "../hooks/useLoginRedirect";
import { AuthenticationErrorType } from "../constants/authentication";
import ErrorMessage from "../components/ErrorMessage";

const Login = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  useLoginRedirect(loggedInUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => navigate("/"))
      .catch(() =>
        setLoginError({ type: AuthenticationErrorType.UNSUCCESSFUL_LOGIN })
      );
  };

  return (
    <Layout>
      <h1 data-testid="login-page">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          data-testid="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email"
        />
        <input
          data-testid="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="password"
        />

        <button data-testid="submit" type="submit">
          Sign in
        </button>

        {!!loginError && (
          <ErrorMessage error={loginError} testId="login-error" />
        )}
      </form>
    </Layout>
  );
};

export default Login;
