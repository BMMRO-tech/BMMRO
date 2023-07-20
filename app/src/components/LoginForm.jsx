/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import { useState, useContext, Fragment } from "react";
import { Formik, Form } from "formik";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import firebase from "firebase/app";
import { useLoginRedirect } from "../hooks/useLoginRedirect";
import { AuthenticationErrorType } from "../constants/authentication";
import colors from "../materials/colors";
import Button from "./Button";
import TextInput from "./formFields/TextInput/TextInput";
import getErrorMessage from "../utils/getErrorMessage";

const LoginForm = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  useLoginRedirect(loggedInUser);
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = ({ email, password }) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(() =>
        setLoginError(
          getErrorMessage(AuthenticationErrorType.UNSUCCESSFUL_LOGIN)
        )
      );
  };

  const styles = {
    form: css`
      padding-top: 10px;

      * {
        margin: 0 auto;
      }

      input {
        max-width: none;
      }
    `,
    error: css`
      color: ${colors.darkRed};
      font-size: 16px;
    `,
  };

  return (
    <Fragment>
      {!!loginError && (
        <div css={styles.error} data-testid="login-error">
          {loginError}
        </div>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form css={styles.form}>
          <TextInput name="email" labelText="Email address" type="email" />
          <TextInput name="password" labelText="Password" type="password" />
          <Button testId="submit" type="submit">
            Log in
          </Button>
        </Form>
      </Formik>
    </Fragment>
  );
};

export default LoginForm;
