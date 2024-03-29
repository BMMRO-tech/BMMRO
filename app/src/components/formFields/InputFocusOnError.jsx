import { useFormikContext } from "formik";
import { useEffect } from "react";

const isDatepicker = (errorField) => {
  return errorField.getAttribute("data-field-type") === "datepicker";
};

const InputFocusOnError = ({ pageHasPositionalValues, hasTriedToSubmit }) => {
  const { isSubmitting, values, validateForm } = useFormikContext();

  useEffect(() => {
    validateForm().then((errors) => {
      if (isSubmitting) {
        const errorField = Object.keys(errors)[0];
        if (errorField) {
          const fieldToFocus =
            errorField === "elapsedTime" ? "endTime" : errorField;

          // ReactDOM.findDOMNode is deprecated in Strict Mode
          const firstFieldWithError =
            document.getElementsByName(fieldToFocus)[0];
          if (isDatepicker(firstFieldWithError)) {
            firstFieldWithError.scrollIntoView({ block: "center" });
          } else {
            firstFieldWithError.focus();
          }
        }
        if (!(typeof pageHasPositionalValues === "undefined")) {
          hasTriedToSubmit(
            !(values.longitude && values.latitude) && !values.gpsMark
          );
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting, validateForm]);
  return null;
};
export default InputFocusOnError;
