const fs = require("fs");
const logAndExit = require("./helpers/logAndExit");

const writeDataToFile = (dirName, fileName, data) => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  const path = `${dirName}/${fileName}`;
  fs.writeFile(path, data, () => logAndExit(`Data has been saved in: ${path}`));
};

module.exports = writeDataToFile;
