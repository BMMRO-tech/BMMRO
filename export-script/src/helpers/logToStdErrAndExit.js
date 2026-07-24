const logToStdErrAndExit = (stringToLog) => {
  console.error(stringToLog);
  process.exit(1);
};

export default logToStdErrAndExit;
