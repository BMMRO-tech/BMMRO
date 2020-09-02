import { useFormikContext } from "formik";
import { useEffect } from "react";

const isDatepicker = (errorField) => {
  return errorField.getAttribute("data-field-type") === "datepicker";
};

const InputFocusOnError = () => {
  const { errors, isSubmitting, validateForm } = useFormikContext();
  useEffect(() => {
    validateForm();
    if (isSubmitting) {
      const errorField = Object.keys(errors)[0];
      console.log(errors);

      if (errorField) {
        // ReactDOM.findDOMNode is deprecated in Strict Mode
        const firstFieldWithError = document.getElementsByName(errorField)[0];
        if (isDatepicker(firstFieldWithError)) {
          firstFieldWithError.scrollIntoView({ block: "center" });
        } else {
          firstFieldWithError.focus();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);
  return null;
};
export default InputFocusOnError;
