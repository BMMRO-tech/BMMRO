import { useFormikContext } from "formik";
import { useEffect } from "react";

const InputFocusOnError = () => {
  const { errors, isSubmitting } = useFormikContext();
  useEffect(() => {
    const errorField = Object.keys(errors)[0];
    if (isSubmitting && errorField) {
      // ReactDOM.findDOMNode is deprecated in Strict Mode
      document.getElementsByName(errorField)[0].focus();
    }
  }, [errors, isSubmitting]);
  return null;
};

export default InputFocusOnError;
