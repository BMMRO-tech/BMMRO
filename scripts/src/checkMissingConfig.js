const Status = require("./helpers/Status");
const errorTypes = require("./constants/messages");

const checkMissingConfig = (projectId, apiKey, authDomain, email, password) => {
  if (!projectId || !apiKey || !authDomain || !email || !password) {
    return new Status("MISSING_ENV_VAR", errorTypes.MISSING_ENV_VAR);
  }

  return new Status("SUCCESS");
};

module.exports = checkMissingConfig;
