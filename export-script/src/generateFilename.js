const { format } = require("date-fns");

const generateFilename = (tableName, startDate, endDate) => {
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");

  return `${tableName}__${formattedStartDate}__${formattedEndDate}.csv`;
};

module.exports = generateFilename;
