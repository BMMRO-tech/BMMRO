const mapFields = (data, config) => {
  const fieldConfig = Object.entries(config);

  return data.map((entry) => {
    const transformedEntry = {};
    fieldConfig.forEach(([finalKey, originalKey]) => {
      transformedEntry[finalKey] = entry[originalKey] || "";
    });
    return transformedEntry;
  });
};

module.exports = mapFields;
