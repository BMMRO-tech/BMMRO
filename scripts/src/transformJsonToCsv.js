const json2csv = require("json2csv").parse;
const mapFields = require("./mapFields");
const config = require("./constants/fieldMaps");

const transformJsonToCsv = (data) => {
  const mappedData = mapFields(data, config.habitatUse);
  return json2csv(mappedData);
};

module.exports = transformJsonToCsv;
