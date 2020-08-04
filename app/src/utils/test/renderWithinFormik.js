/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Formik, Form, useFormikContext } from "formik";
import { render } from "@testing-library/react";

const renderWithinFormik = (uiNode, initialValues) => {
  const PrintContextWrapper = ({ uiNode }) => {
    const { values, errors } = useFormikContext();

    return (
      <div>
        <div data-testid="formik-values">{JSON.stringify(values)}</div>
        <div data-testid="formik-errors">{JSON.stringify(errors)}</div>
        <Form>{uiNode}</Form>
      </div>
    );
  };

  const rtlReturnBundle = {
    ...render(
      <Formik initialValues={initialValues}>
        <PrintContextWrapper uiNode={uiNode} />
      </Formik>
    ),
  };

  const getFormValues = () => {
    return JSON.parse(rtlReturnBundle.getByTestId("formik-values").textContent);
  };
  const getFormErrors = () => {
    return JSON.parse(rtlReturnBundle.getByTestId("formik-errors").textContent);
  };

  return {
    getFormValues,
    getFormErrors,
    ...rtlReturnBundle,
  };
};

export default renderWithinFormik;
