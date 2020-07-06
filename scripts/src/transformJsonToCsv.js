const json2csv = require("json2csv").parse;

const transformJsonToCsv = (data) => {
  return json2csv(data);
};

module.exports = transformJsonToCsv;
