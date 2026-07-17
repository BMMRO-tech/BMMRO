import fs from "fs";
import logToStdErrAndExit from "./helpers/logToStdErrAndExit.js";

const writeDataToFile = (dirName, fileName, data) => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  const path = `${dirName}/${fileName}`;

  try {
    fs.writeFileSync(path, data);
    console.log(`Data has been saved in: ${path}`);
  } catch (e) {
    logToStdErrAndExit(e.message);
  }
};

export default writeDataToFile;
