const mapFields = (data, config) => {
  const tableConfig = Object.entries(config);

  return data.map((entry) => {
    const transformedEntry = {};
    tableConfig.forEach(([finalFieldName, fieldConfig]) => {
      const fieldValue = fieldConfig.transform
        ? fieldConfig.transform(entry[fieldConfig.key])
        : entry[fieldConfig.key];
      transformedEntry[finalFieldName] = fieldValue || "";
    });
    return transformedEntry;
  });
};

module.exports = mapFields;
