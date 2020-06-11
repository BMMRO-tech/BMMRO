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

  const handleSubmit = (event) => {
    event.preventDefault();

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => navigate("/"))
      .catch((err) => alert(err));
  };

  useEffect(() => {
    if (loggedInUser) navigate("/");
  }, [loggedInUser]);

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="password"
        />

        <button type="submit">Sign in</button>
      </form>
    </Layout>
  );
};

export default Login;
