const { parse, isValid } = require("date-fns");
const { exportDataToCSV } = require("./src/exportDataToCSV");

const errorType = {
  MISSING_ENV_VAR:
    "Missing env variable(s). Make sure you defined PROJECT_ID, API_KEY, AUTH_DOMAIN, USERNAME and PASSWORD.",
  MISSING_ARG:
    "Missing script argument(s). Make sure you defined start date and and date.",
  INVALID_DATE_FORMAT: "Dates must be in format dd/MM/yyyy",
  END_DATE_BEFORE_START_DATE: "End date must be after start date",
};

const DATE_FORMAT = "dd/MM/yyyy";

const checkMissingConfigValues = () => {
  if (
    !process.env.PROJECT_ID ||
    !process.env.API_KEY ||
    !process.env.AUTH_DOMAIN ||
    !process.env.USERNAME ||
    !process.env.PASSWORD
  ) {
    throw new Error(errorType.MISSING_ENV_VAR);
  }

  if (!process.argv[2] || !process.argv[3]) {
    throw new Error(errorType.MISSING_ARG);
  }
};

const validateDates = (startDate, endDate) => {
  if (!isValid(startDate) || !isValid(endDate)) {
    throw new Error(errorType.INVALID_DATE_FORMAT);
  }

  if (startDate > endDate) {
    throw new Error(errorType.END_DATE_BEFORE_START_DATE);
  }
};

const exportData = async function () {
  checkMissingConfigValues();

  const startDate = parse(process.argv[2], DATE_FORMAT, new Date());
  const endDate = parse(process.argv[3], DATE_FORMAT, new Date());

  validateDates(startDate, endDate);

  console.log(
    `Exporting all data from ${process.argv[2]} until ${process.argv[3]}`
  );

  await exportDataToCSV(
    process.env.PROJECT_ID,
    process.env.API_KEY,
    process.env.AUTH_DOMAIN,
    process.env.USERNAME,
    process.env.PASSWORD,
    startDate,
    endDate
  );
};

exportData();

exports.exportData = exportData;
