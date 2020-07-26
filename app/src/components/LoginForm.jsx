/** @jsx jsx */
import { useState, useContext, Fragment } from "react";
import { Formik, Form } from "formik";
import { jsx, css } from "@emotion/core";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import firebase from "firebase/app";
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
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(() =>
        setLoginError({ type: AuthenticationErrorType.UNSUCCESSFUL_LOGIN })
      );
  };

  const styles = {
    form: css`
      padding-top: 10px;
    `,
    button: css`
      margin: 0 auto;
    `,
  };

  return (
    <Fragment>
      {!!loginError && (
        <ErrorMessage
          error={loginError}
          isInputFieldError={false}
          testId="login-error"
        />
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form css={styles.form}>
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
          <div css={styles.buttonContainer}>
            <Button styles={styles.button} testId="submit" type="submit">
              Log in
            </Button>
          </div>
        </Form>
      </Formik>
    </Fragment>
  );
};

export default LoginForm;
