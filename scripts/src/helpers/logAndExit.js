const logAndExit = (stringToLog) => {
  console.error(stringToLog);
  process.exit(0);
};

module.exports = logAndExit;
