const mapFields = (data, config) => {
  const tableConfig = Object.entries(config);

  return data.map((entry) => {
    const transformedEntry = {};
    tableConfig.forEach(([finalFieldName, fieldConfig]) => {

      let fieldValue = undefined;

      if(fieldConfig.transform) {
        fieldValue = fieldConfig.transform(entry[fieldConfig.key], entry)
      }
      else if (fieldConfig.key.includes(".")) {
        const keys = fieldConfig.key.split(".");
        fieldValue = entry[keys[0]][keys[1]];
      } else {
        fieldValue = entry[fieldConfig.key];
      }

      transformedEntry[finalFieldName] =
        fieldValue === undefined ? "" : fieldValue;
    });
    return transformedEntry;
  });
};

module.exports = mapFields;
