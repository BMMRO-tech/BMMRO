const { format } = require("date-fns");

const generateFilename = (startDate, endDate) => {
  return (
    format(startDate, "yyyy-MM-dd") +
    "__" +
    format(endDate, "yyyy-MM-dd") +
    "__db.csv"
  );
};

module.exports = generateFilename;
