const json2csv = require("json2csv").parse;
const mapFields = require("./mapFields");

const transformJsonToCsv = (data, config) => {
  const mappedData = mapFields(data, config);
  return json2csv(mappedData);
};

module.exports = transformJsonToCsv;
