const fs = require("fs");
const logAndExit = require("./helpers/logAndExit");
const logToStdErrAndExit = require("./helpers/logToStdErrAndExit");

const writeDataToFile = (dirName, fileName, data) => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  const path = `${dirName}/${fileName}`;

  try {
    fs.writeFileSync(path, data);
    logAndExit(`Data has been saved in: ${path}`);
  } catch (e) {
    logToStdErrAndExit(e.message);
  }
};

module.exports = writeDataToFile;
