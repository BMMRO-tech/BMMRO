import Status from "./helpers/Status.js";
import getMessage from "./constants/getMessage.js";

const checkMissingConfig = (projectId, apiKey, authDomain, email, password) => {
  if (!projectId || !apiKey || !authDomain || !email || !password) {
    return new Status("MISSING_ENV_VAR", getMessage("MISSING_ENV_VAR"));
  }

  return new Status("SUCCESS");
};

export default checkMissingConfig;
