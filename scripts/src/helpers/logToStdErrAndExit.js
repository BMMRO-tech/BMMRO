const logToStdErrAndExit = (stringToLog) => {
  console.error(stringToLog);
  process.exit(1);
};

module.exports = logToStdErrAndExit;
