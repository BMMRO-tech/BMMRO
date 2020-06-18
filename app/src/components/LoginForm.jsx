/** @jsx jsx */
import { useState, useContext, Fragment } from "react";
import { Formik, Form } from "formik";
import { jsx } from "@emotion/core";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import firebaseApp from "../firebaseContext/firebase";
import { useLoginRedirect } from "../hooks/useLoginRedirect";
import { AuthenticationErrorType } from "../constants/authentication";
import ErrorMessage from "./ErrorMessage";
import Button from "./Button";
import Input from "./Input";

const LoginForm = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  useLoginRedirect(loggedInUser);
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = ({ email, password }) => {
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(() =>
        setLoginError({ type: AuthenticationErrorType.UNSUCCESSFUL_LOGIN })
      );
  };

  return (
    <Fragment>
      {!!loginError && <ErrorMessage error={loginError} testId="login-error" />}

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <Input
            config={{
              label: "Email address",
              type: "email",
              name: "email",
            }}
          />
          <Input
            config={{
              label: "Password",
              type: "password",
              name: "password",
            }}
          />
          <Button testId="submit" type="submit" width="100%">
            Log in
          </Button>
        </Form>
      </Formik>
    </Fragment>
  );
};

export default LoginForm;
