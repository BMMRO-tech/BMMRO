module.exports = {
  MISSING_ENV_VAR:
    "Missing env variable(s). Make sure you defined PROJECT_ID, API_KEY, AUTH_DOMAIN, EMAIL and PASSWORD.",
  MISSING_ARG:
    "Missing script argument(s). Make sure you defined start date and and date.",
  INVALID_DATE_FORMAT: "Dates must be in format dd/MM/yyyy.",
  END_DATE_BEFORE_START_DATE: "End date must be after start date.",
  NO_DATA: 'There were no entries within given time range, so no csv file will be created.'
};
