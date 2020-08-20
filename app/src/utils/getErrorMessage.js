import { FormErrorType } from "../constants/forms";
import { AuthenticationErrorType } from "../constants/authentication";
import { DatastoreErrorType } from "../constants/datastore";

const getErrorMessage = (type, params) => {
  switch (type) {
    case FormErrorType.MAX_VALUE:
      return `Value must be less than or equal to ${params.value}`;
    case FormErrorType.MIN_VALUE:
      return `Value must be greater than or equal to ${params.value}`;
    case FormErrorType.INVALID_NUMBER_FORMAT:
      return "Invalid number format";
    case FormErrorType.INVALID_TIME_FORMAT:
      return `Time must be in the following format ${params.format}`;
    case FormErrorType.INVALID_END_DATE:
      return "Invalid end date";
    case FormErrorType.INVALID_END_TIME:
      return "Invalid end time";
    case FormErrorType.INVALID_POSITION_FORMAT:
      return "Invalid position format";
    case FormErrorType.INVALID_DECIMAL_PLACES:
      return `Position must have ${params.decimalPlaces} decimal places`;
    case FormErrorType.MAX_DECIMAL_PLACES:
      return `Field can only have a maximum of ${params.maxDecimalPlaces} decimal places`;
    case FormErrorType.EMPTY:
      return "Required";
    case FormErrorType.END_TIME_BEFORE_START_TIME:
      return "End time cannot be before start time";
    case FormErrorType.END_DATE_BEFORE_START_DATE:
      return "End date cannot be before start date";
    case AuthenticationErrorType.UNSUCCESSFUL_LOGIN:
      return "The email address or password you entered is not recognised. Please try again.";
    case AuthenticationErrorType.UNSUCCESSFUL_LOGOUT:
      return "There was an error while logging out. Please try again.";
    case DatastoreErrorType.UNKNOWN_OFFLINE_SUPPORT:
      return "Unknown error. Please hit the 'Refresh' button below.";
    case DatastoreErrorType.MULTIPLE_TABS:
      return "The app is open in multiple tabs. Please close other tabs to enable offline storage and hit the 'Refresh' button below.";
    case DatastoreErrorType.BROWSER_NOT_SUPPORTED:
      return "Your current browser is not supported. Please open the app in Chrome, Safari or Firefox.";
    case DatastoreErrorType.INITIALIZATION:
      return "Connection to the database could not be established. Please hit the 'Refresh' button below.";
    default:
      return "";
  }
};

export default getErrorMessage;
