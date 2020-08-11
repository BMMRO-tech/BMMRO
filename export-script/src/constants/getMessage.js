const getMessage = (type, params) => {
  switch (type) {
    case "MISSING_ENV_VAR":
      return "Missing env variable(s). Make sure you defined PROJECT_ID, API_KEY, AUTH_DOMAIN, EMAIL and PASSWORD.";
    case "MISSING_ARG":
      return "Missing script argument(s). Make sure you defined start date and end date.";
    case "INVALID_DATE_FORMAT":
      return "Dates must be in format dd/MM/yyyy.";
    case "END_DATE_BEFORE_START_DATE":
      return "End date must be after start date.";
    case "NO_DATA":
      return "There were no entries within given time range, so no csv file will be created.";
    case "BATCH_UPDATE_FAILED":
      return "There was an error when updating the docs. No records have been marked as exported. Please re-run the script with the same date range.";
    case "BATCH_UPDATE_SUCCESSFUL":
      return "Exported data has been marked as exported in the Firestore database.";
    case "BATCH_UPDATE_LIMIT_EXCEEDED":
      return `You are trying to mark ${params.numberOfEntries} entries as exported. The Firebase batch update limit is 500. Please narrow your date range.`;
    default:
      return "";
  }
};

module.exports = getMessage;
