import { useFormikContext } from "formik";
import { useEffect } from "react";

const InputFocusOnError = () => {
  const { errors, isSubmitting, validateForm } = useFormikContext();
  useEffect(() => {
    validateForm();

    if (isSubmitting) {
      const errorField = Object.keys(errors)[0];

      if (errorField) {
        // ReactDOM.findDOMNode is deprecated in Strict Mode
        document.getElementsByName(errorField)[0].focus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);
  return null;
};
export default InputFocusOnError;
