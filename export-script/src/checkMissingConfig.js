const Status = require("./helpers/Status");
const getMessage = require("./constants/getMessage");

const checkMissingConfig = (projectId, apiKey, authDomain, email, password) => {
  if (!projectId || !apiKey || !authDomain || !email || !password) {
    return new Status("MISSING_ENV_VAR", getMessage("MISSING_ENV_VAR"));
  }

  return new Status("SUCCESS");
};

module.exports = checkMissingConfig;
