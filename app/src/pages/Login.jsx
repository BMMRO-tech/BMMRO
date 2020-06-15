/** @jsx jsx */
import { useState, useContext, useEffect } from "react";
import { jsx } from "@emotion/core";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import firebaseApp from "../firebaseContext/firebase";
import Layout from "../components/Layout";
import { navigate } from "@reach/router";

const Login = () => {
  const { loggedInUser } = useContext(FirebaseContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => navigate("/"))
      .catch(() => setLoginError("There was an error."));
  };

  useEffect(() => {
    if (loggedInUser) navigate("/");
  }, [loggedInUser]);

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

        {!!loginError && <div data-testid="login-error">{loginError}</div>}
      </form>
    </Layout>
  );
};

export default Login;
